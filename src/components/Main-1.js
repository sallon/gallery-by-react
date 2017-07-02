require('normalize.css/normalize.css');
require('styles/base.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//装载
var imageDatas = require('../data/imagesDatas.json');
//自执行函数
imageDatas = (function genImageURL(imageDatasArr){
  for(var i = 0,j=imageDatasArr.length;i<j;i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);
// let yeomanImage = require('../images/yeoman.png');
/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(n,m){
  return Math.ceil(n+Math.random()*(m-n));
}
/*
 * 获取 0~30° 之间的一个任意正负值
 */
function get30DegRandom() {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}


var ImgFigure = React.createClass({
  handleClick:function(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },
  render:function(){
    // console.log('ImgFigure');
    var styleObj={};
    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj=this.props.arrange.pos;
    }
    if(this.props.arrange.rotate){
      (['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
        styleObj[value]='rotate('+this.props.arrange.rotate+'deg)';
      }.bind(this));

    }
    // 如果是居中的图片， z-index设为11
    if(this.props.arrange.isCenter){
      styleObj.zIndex=11;
    }
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse?'is-inverse':'';
    return (
      <figure className="img-figure" style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL } alt={this.props.data.title}/>
        <figcaption className="img-title">
          <h2>{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );

  }
})
// 控制组件
var ControllerUnit=React.createClass({
  handleClick:function(e){
    // 如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  },
  render:function(){
    var controlelrUnitClassName='controller-unit';
    if(this.props.arrange.isCenter){
      controlelrUnitClassName+=' is-center';
      // 如果同时对应的是翻转图片， 显示控制按钮的翻转态
      if(this.props.arrange.isInverse){
        controlelrUnitClassName += ' is-inverse';
      }
    }
    return (
      <span className={controlelrUnitClassName} onClick={this.handleClick}></span>
    );
  }
});
// class AppComponent extends React.Component {
var AppComponent = React.createClass({
  'Constant':{
    'centerPos':{
      'left':0,
      'right':0
    },
    'hPosRange':{
      'leftSecX':[0,0],
      'rightSecX':[0,0],
      'y':[0,0]
    },
    'vPosRange':{
      'x':[0,0],
      'topY':[0,0]
    }
  },
  // 组件加载以后， 为每张图片计算其位置的范围
  componentDidMount:function(){
    //首先拿到舞台大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW/2),
      halfStageH = Math.ceil(stageH/2);
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgFigureW = imgFigureDOM.scrollWidth,
      imgFigureH = imgFigureDOM.scrollHeight,
      halfImgFigureW = Math.ceil(imgFigureW/2),
      halfImgFigureH = Math.ceil(imgFigureH/2);
    // 计算中心图片的位置点
    this.Constrant.CenterPos = {
      left:halfStageW - halfImgFigureW,
      top:halfStageH - halfImgFigureH
    };
    // 计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0]=-halfImgFigureW;
    this.Constant.hPosRange.leftSecX[1]=halfStageW - halfImgFigureW * 3;
    this.Constant.hPosRange.rightSecX[0]=halfStageW + halfImgFigureW;
    this.Constant.hPosRange.rightSecX[1]=stageW - halfImgFigureW;
    this.Constant.hPosRange.y[0]=-halfImgFigureH;
    this.Constant.hPosRange.y[1]=stageH - halfImgFigureH;

  },
  /*
   * 翻转图片
   * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
   */
  inverse:function(index){
    return function(){
      var imgsArrangeArr=this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }.bind(this);
  },
  /*
   * 图片居中
   * @param index 传入当前被执行center操作的图片对应的图片信息数组的index值
   * @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
   */
  center:function(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  },
  rearrange:function(centerIndex){
    var imgsArrangeArr=this.state.imgsArrangeArr,
      Constant=this.Constant,
      centerPos=Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      //上方图片--取出要布局上侧的图片的状态信息
      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),    // 取一个或者不取
      topImgSpliceIndex = 0,
      topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
      imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
      imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    });

    //居中图片--首先居中 centerIndex 的图片, 居中的 centerIndex 的图片不需要旋转
    var imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    imgsArrangeCenterArr[0]={
      pos:centerPos,
      rotate:0,
      isCenter:true
    };
    // 布局左右两侧的图片
    for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
      var hPosRangeLORX = null;
      // 前半部分布局左边， 右半部分布局右边
      if(i<k){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else{
        hPosRangeLORX=hPosRangeRightSecX;
      }
      imgsArrangeArr[i]={
        pos:{
          top:getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left:getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    }
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });

  },

  getInitialState:function(){
    return {
      imgsArrangeArr:[
        {
          // pos:{
          //   left:0,
          //   top:0
          // }
        }
      ]
    }
  },

  render:function(){
    var ControllerUnit = [],
      imgFigures=[];
    imageDatas.forEach(function(value,index){
      //初始化每个元素
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index]={
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        };
      }

      imgFigures.push(
        <ImgFigure key={index}
                   data={value}
                   ref={'imageFigure'+index}
                   arrange={this.state.imgsArrangeArr[index]}
                   inverse={this.inverse(index)}
                   center={this.center(index)}
        />
      );
      ControllerUnit.push(
        <ControllerUnit
          key={index}
          arrange={this.state.imgsArrangeArr[index]}
          inverse={this.inverse(index)}
          center={this.center(index)}
        />
      );
    }.bind(this));


    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {ControllerUnit }
        </nav>
      </section>
    );
  }

})

AppComponent.defaultProps = {
};

export default AppComponent;
