// miniprogram/pages/poster/poster.js
Page({

	data: { 
    content:{},//
		chosenIndex:0,//
		//imagePath: '',
		//canvasHidden: true,
		maskHidden:true,//
		modeArray:['灰色','蓝色','粉色','黄色']//
  },
  
  imagePath: '',

	bindModeChange:function(e){
		this.setData({chosenIndex:e.detail.value})
	},

	onLoad: function (options) {
    console.log(options);
    this.setData({content:options})
	},

	backgroundPicSrcDetail:'',
	backgroundPicSrc:[
		'https://mmbiz.qpic.cn/mmbiz_png/bz1d0u9o51UdnicicuR8bqjA0pVHICnWQPwLGJ5ZywSdQibo48vdLent8exqLwFKv4AGQjsIF6NkuBMIoHZDqlkMQ/0?wx_fmt=png',
		'https://mmbiz.qpic.cn/mmbiz_png/bz1d0u9o51UdnicicuR8bqjA0pVHICnWQPiaiaBU99TdkoqCPFDXKw1L2pkdIjjLicmBla9B95Pcp32TZib71jzHAOsw/0?wx_fmt=png',
	 'https://mmbiz.qpic.cn/mmbiz_png/bz1d0u9o51UdnicicuR8bqjA0pVHICnWQPfTiaWjXNbE6F4DHmy7HbeXfD40pBw03LsBXavXup51ywKAOts0DJrAA/0?wx_fmt=png',
	 'https://mmbiz.qpic.cn/mmbiz_png/bz1d0u9o51UdnicicuR8bqjA0pVHICnWQPgbypYHGOcyggTQTg6jrRksH2gwQPuY6VxECtuIKOttpXHOmuX1oOyQ/0?wx_fmt=png'
	],

	generate:function(){
    var that=this;
    wx.downloadFile({
      url:that.backgroundPicSrc[that.data.chosenIndex],
      complete: result => {
      	//console.log(result.tempFilePath)
				if (result.tempFilePath==undefined){that.webBug();return}
				console.log(result.tempFilePath)
        that.backgroundPicSrcDetail= result.tempFilePath;
        that.createImage();
      }
    })
  },

  createImage:function(){
    this.setData({
      maskHidden:false
    })
    var that = this;
    var context = wx.createCanvasContext('myCanvas');
    context.draw();
    const { windowWidth, windowHeight } = wx.getSystemInfoSync()
    const ratio=windowWidth/750;
    context.drawImage(this.backgroundPicSrcDetail, 0, 0, windowWidth * 650 / 750, windowWidth * 1052 / 750);
    context.stroke();
    context.font='14px sans-serif'
    //context.setFontSize(parseInt(40*ratio));
    context.fillText(this.data.content.parta,96*ratio,634*ratio);
    context.stroke();
    context.font='14px sans-serif'
    //context.setFontSize(parseInt(30*ratio));
    var items=[this.data.content.partb,this.data.content.partc,this.data.content.partd,this.data.content.parte,this.data.content.partf,this.data.content.partg,this.data.content.parth]
    for(var i=0;i<7;i++){
      context.fillText(items[i],96*ratio,(689+i*45)*ratio);
    }
    context.draw();

    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            maskHidden: false
          });
          that.imagePath=tempFilePath;
        },
        fail: function (res) {
          console.log(res);
        }
      },that);
    }, 200);
  },

  baocun: function () {
    var that = this
    console.log('start to save')
    wx.saveImageToPhotosAlbum({
      filePath: that.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: true
              })
            }

          }, fail: function (res) {
            console.log('保存失败')
          }
        })
      }
    })
  },

  baocun2:function(){
    this.setData({
      maskHidden:true
    })
  },

  webBug:function(){
    this.setData({
      disabled:false
    })
    wx.showModal({
      title: '提示',
      content: '网络故障 请重新进入页面',
			showCancel:false,
			success:function(res){
				if(res.confirm){
					wx.navigateBack({})
				}
			}
    })
  },

  quit:function(){
    wx.navigateBack({
    })
  }

	
})