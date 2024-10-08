// index.js
Page({
  onReady:function() {
    var audio = wx.getBackgroundAudioManager()
    audio.onPlay(() => {
      console.log('音频的长度：'+audio.duration);
    })
    //监听暂停事件
    audio.onPause(() =>{
      console.log('背景音频当前为暂停状态：'+audio.paused)
    })
    //监听背景音频播放进度更新事件
    audio.onTimeUpdate(() =>{
      console.log('当前播放的位置：'+audio.currentTime)
    })
    audio.src = 'http://127.0.0.1:3000/3.mp3'
    audio.title = '音频标题'
    //定时器切歌
    setTimeout(() =>{
      audio.src='http://127.0.0.1:3000/4.mp3'
      audio.title ='切换'
    }, 5*1000)
  },
  scroll: function(e) {
    console.log(e)
  },
  sliderChanging: function(event) {
    console.log(event)
  }
})
