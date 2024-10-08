// pages/audio2/audio2.js
//格式化时间
function formatTime(time) {
  var minute = Math.floor(time/60) % 60
  var second = Math.floor(time) % 60
  return (minute<10?'0'+minute : minute)+ ':'+(second<10?'0'+second:second)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: 0,
    playIndex: 0,//当前播放的歌曲下标值
    playlist: [
      {
        id: 1,
        title: '祝你生日快乐',
        singer: '小丽',
        src: 'http://localhost:3000/1.mp3',
        coverImgUrl: '/pages/audio2/images/cover.jpg'
      }, {
        id: 2,
        title: '劳动最光荣',
        singer: '小明',
        src: 'http://localhost:3000/2.mp3',
        coverImgUrl: '/pages/audio2/images/cover.jpg'
      }, {
        id: 3,
        title: '龙的传人',
        singer: '小画',
        src: 'http://localhost:3000/3.mp3',
        coverImgUrl: '/pages/audio2/images/cover.jpg'
      }
    ],
    play: {
      title: '',
      singer: '',
      coverImgUrl: '',
      state: 'paused',
      currentTime: '00:00',
      duration: '00:00',
      percent: 0
      //描述当前在播的音乐对象
    }
  },
  audio: null,
  onReady() {
    this.audio = wx.getBackgroundAudioManager()
    this.setMusic()
    //监听音频自然结束
    this.audio.onEnded(() => {
      this.next()
    })
    //监听音频播放事件
    this.audio.onPlay(() => {
      this.setData({
        'play.state': 'running'
      })
      
    })
    //监听音频暂停事件
    this.audio.onPause(() => {
      this.setData({
        'play.state': 'paused'
      })
    })
    //监听音频进度更新事件
    var updataTime = 0 //限制1s更新一次数据
    this.audio.onTimeUpdate(() => {
      var currentTime = parseInt(this.audio.currentTime)
      console.log(currentTime)
      if(!this.sliderChangeLock && updataTime != currentTime) {
        updataTime = currentTime
        this.setData({
          'play.currentTime': formatTime(currentTime),
          'play.duration': formatTime(this.audio.duration),
          'play.percent': currentTime / this.audio.duration * 100
        })
      }
      
    })
  },
  //切换下一曲的事件处理函数
  //设置当前播放音乐的函数
  setMusic() {
    var music = this.data.playlist[this.data.playIndex]
    this.audio.src = music.src
    this.audio.title = music.title
    this.setData({
      'play.title': music.title,
      'play.singer': music.singer,
      'play.coverImgUrl': music.coverImgUrl
    })
  },
  //切换下一首的事件处理函数
  next() {
    //更新playIndex的值
    //更新背景音乐实例的src和title属性值
    // if(this.datd.playIndex == this.data.playlist.length -1) {
    //   var index = 0
    // } else{
    //   var index = ++this.data.playIndex
    // }
    var index = this.data.playIndex==this.data.playlist.length -1 ? 0:++this.data.playIndex
    this.setData ({
      playIndex: index
    })
    this.setMusic()
  },
  //继续播放的事件处理函数
  play() {
    this.audio.play()
  },
  //暂停播放的事件处理函数
  pause() {
    this.audio.pause()
  },
//tab切换的事件处理函数
changeItem(event) {
  // console.log(event.currentTarget.dataset.val)
  this.setData({
    item: event.currentTarget.dataset.val
  })
},
changeTab(event) {
  console.log(event)
  this.setData({
    item: event.detail.current
  })
},
//拖拽进行中的事件处理函数
sliderChangeLock: false,
sliderChanging(e) {
  this.sliderChangeLock = true
  var value = e.detail.value
  var currentTime = value * this.audio.duration / 100
  this.setData({
    'play.currentTime': formatTime(currentTime)
  })
},
//拖拽完成的事件处理函数
sliderChange(e) {
  var value = e.detail.value
  var currentTime = value * this.audio.duration / 100
  this.audio.seek(currentTime)
  setTimeout(() =>{
    this.sliderChangeLock = false
  }, 1000)

},
//切换歌曲的事件处理函数
change(e) {
  //更新playIndex的值
  this.setData({
    playIdenx:e.currentTarget.dataset.index
  })
  //更新背景音频相关属性值
  this.setMusic()
}
})