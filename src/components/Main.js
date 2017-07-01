require('normalize.css/normalize.css');
require('styles/base.scss');

import React from 'react';

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

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

  export default AppComponent;
