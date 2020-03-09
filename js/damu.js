(function (w) {
    w.damu = {}
    w.damu.css = function (node, type, val) {
        if (typeof node == 'object' && typeof node['transform'] == 'undefined') {
            node['transform'] = {}
        }
        if (arguments.length >= 3) {
            var text = ''
            node['transform'][type] = val
            for (item in node['transform']) {
                if (node['transform'].hasOwnProperty(item)) {
                    switch (item) {
                        case 'translateX':
                        case 'translateY':
                            text += item + '(' + node['transform'][item] + 'px)'
                            break;
                        case 'scale':
                            text += item + '(' + node['transform'][item] + ')'
                            break;
                        case 'rotate':
                            text += item + '(' + node['transform'][item] + 'deg)'
                            break;
                    }
                }
            }
            node.style.transform = node.style.webkitTransform = text
        } else if (arguments.length == 2) {
            val = node['transform'][type]
            if (typeof val == 'undefined') {
                switch (type) {
                    case 'translateX':
                    case 'translateY':
                    case 'rotate':
                        val = 0
                        break;
                    case 'scale':
                        val = 1
                        break;
                }
            }
            return val
        }
    }
    w.damu.carousel = function (arr) {
        var carouselWrap = document.querySelector('.carousel-wrap');
        var styleNode = document.createElement('style');
        if (carouselWrap) {
            var pointsLength = arr.length
            var needCarousel = carouselWrap.getAttribute('needCarousel')
            needCarousel = needCarousel == null ? false : true
            if (needCarousel) {
                //concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。
                arr = arr.concat(arr)
            }
            var ulNode = document.createElement('ul');
            ulNode.classList.add('list')
            for (let i = 0; i < arr.length; i++) {
                ulNode.innerHTML += '<li><a href="javascript:;"><img src="' + arr[i] + '"/></a></li>';
            }
            styleNode.innerHTML = '.carousel-wrap>.list {width: ' + (arr.length * 100) + '%;}.carousel-wrap>.list>li {width: ' + (1 / arr.length * 100) + '%;}'
            carouselWrap.appendChild(ulNode)
            document.head.appendChild(styleNode)
            imgNode = document.querySelector('.carousel-wrap>.list>li>a>img');
            setTimeout(function () {
                carouselWrap.style.height = imgNode.offsetHeight + 'px'
            }, 100)

            var pointsWrap = document.querySelector('.carousel-wrap > .points-wrap')
            if (pointsWrap) {
                for (let i = 0; i < pointsLength; i++) {
                    if (i == 0) {
                        pointsWrap.innerHTML += '<span class="active"></span>'
                    } else {
                        pointsWrap.innerHTML += '<span></span>'
                    }
                }
            }
            var pointsSpan = document.querySelectorAll('.carousel-wrap > .points-wrap > span')

            //手指一开始的位置
            var startX = 0;
            //元素一开始的位置
            var elementX = 0;
            //滑动的距离
            var disX = 0
            //图片下标
            var index = 0
            //translateX的偏移量与offsetLeft不在一个图层
            // var translateX=0
            carouselWrap.addEventListener('touchstart', function (ev) {
                ulNode.style.transition = 'none'
                /* 点第一组的第一张时，跳到第二组的第一张
                点第二组的最后一张时，跳到第一组的最后一张 */
                if (needAuto) {
                    var index = damu.css(ulNode, 'translateX') / document.documentElement.offsetWidth
                    if (-index == 0) {
                        index = -pointsLength
                    } else if (-index == arr.length - 1) {
                        index = 1 - pointsLength
                    }
                    damu.css(ulNode, 'translateX', index * document.documentElement.offsetWidth)
                }
                var touchC = ev.changedTouches[0]
                startX = touchC.clientX
                elementX = damu.css(ulNode, 'translateX')
                //清除定时器
                clearInterval(timer)
            })
            carouselWrap.addEventListener('touchmove', function (ev) {
                var touchC = ev.changedTouches[0]
                var nowX = touchC.clientX
                disX = nowX - startX
                // translateX=elementX+disX
                // ulNode.style.left=elementX+disX+'px'
                // ulNode.style.transform='translateX('+translateX+'px)'
                damu.css(ulNode, 'translateX', elementX + disX)
            })
            carouselWrap.addEventListener('touchend', function () {
                index = damu.css(ulNode, 'translateX') / document.documentElement.offsetWidth
                //四舍五入
                index = Math.round(index)
                if (index > 0) {
                    index = 0
                } else if (index < 1 - arr.length) {
                    index = 1 - arr.length
                }
                xiaoyuandian(index)
                /* //向右滑
                if (disX>0) {
                    index=Math.ceil(index)
                //向左滑
                }else if (disX<0) {
                    index=Math.floor(index)
                } */
                ulNode.style.transition = '0.5s transform'
                // translateX=index*(document.documentElement.clientWidth)
                // ulNode.style.left=index*(document.documentElement.clientWidth)+'px'
                // ulNode.style.transform='translateX('+translateX+'px)'
                damu.css(ulNode, 'translateX', index * (document.documentElement.clientWidth))
                if (needAuto) {
                    //开启自动轮播
                    auto()
                }
            })
            var timer = 0
            var needAuto = carouselWrap.getAttribute('needAuto')
            needAuto = needAuto == null ? false : true
            if (needAuto) {
                //开启自动轮播
                auto()
            }
            //自动轮播
            function auto() {
                clearInterval(timer)
                timer = setInterval(function () {
                    if (index == 1 - arr.length) {
                        index = 1 - arr.length / 2
                        ulNode.style.transition = 'none'
                        damu.css(ulNode, 'translateX', index * document.documentElement.clientWidth)
                    }
                    setTimeout(function () {
                        index--;
                        ulNode.style.transition = '1s transform'
                        xiaoyuandian(index)
                        damu.css(ulNode, 'translateX', index * document.documentElement.clientWidth)
                    }, 50)
                }, 2000)
            }
            //小圆点发生改变
            function xiaoyuandian(index) {
                if (!pointsWrap) {
                    return
                }
                for (let i = 0; i < pointsSpan.length; i++) {
                    pointsSpan[i].classList.remove('active')
                }
                pointsSpan[-index % pointsLength].classList.add('active')
            }
        }
    }
    w.damu.dragNav = function () {
        var wrap = document.querySelector(".damu-nav-drag-wrapper");
        var item = document.querySelector("#wrap .content .damu-nav-drag-wrapper .list");

        //手指一开始的位置
        var startX = 0;
        // 元素的初始位置
        var elementX = 0;
        // ul的translateX样式的最小值
        var minX = wrap.clientWidth - item.offsetWidth;

        // 快速滑屏的参数
        var lastTime = 0;
        var lastPoint = 0;
        // 时间间隔
        var timeDis = 1;
        // 距离
        var pointDis = 0;
        wrap.addEventListener("touchstart", function (ev) {
            var touchC = ev.changedTouches[0];
            startX = touchC.clientX;
            elementX = damu.css(item, "translateX");
            item.style.transition = "none";
            // 获取当前的时间
            lastTime = new Date().getTime();
            // 获取手指的位置
            lastPoint = touchC.clientX;
            pointDis = 0;
            item.handMove = false;
        });
        wrap.addEventListener("touchmove", function (ev) {
            var touchC = ev.changedTouches[0];
            var nowX = touchC.clientX;
            disX = nowX - startX;
            var translateX = elementX + disX;

            // 获取当前的时间
            var nowTime = new Date().getTime();
            // 获取手指的位置
            var nowPoint = touchC.clientX;
            timeDis = nowTime - lastTime;
            pointDis = nowPoint - lastPoint;
            lastTime = nowTime;
            lastPoint = nowPoint;

            // 橡皮筋效果
            if (translateX > 0) {
                // 表示手动橡皮筋效果
                item.handMove = true;
                // var scale=1-translateX/document.documentElement.clientWidth;
                var scale = document.documentElement.clientWidth / (document.documentElement.clientWidth + translateX);
                translateX = damu.css(item, "translateX") + pointDis * scale;
                // translateX=0;
            } else if (translateX < minX) {
                item.handMove = true;
                // translateX=minX;
                var over = minX - translateX;
                var scale = document.documentElement.clientWidth / (document.documentElement.clientWidth + over);
                translateX = damu.css(item, "translateX") + pointDis * scale;
            }
            damu.css(item, "translateX", translateX);

        });
        wrap.addEventListener("touchend", function (ev) {
            if (!item.handMove) {
                /* 快速滑屏 */
                var translateX = damu.css(item, "translateX");
                var speed = pointDis / timeDis;
                speed = Math.abs(speed) < 0.5 ? 0 : speed;
                var targetX = translateX + speed * 200;

                var time = Math.abs(speed) * 0.2;
                time = time < 0.8 ? 0.8 : time;
                time = time > 2 ? 2 : time;


                var bsr = "";

                if (targetX > 0) {
                    targetX = 0;
                    bsr = "cubic-bezier(.26,1.51,.68,1.54)";
                } else if (targetX < minX) {
                    targetX = minX;
                    bsr = "cubic-bezier(.26,1.51,.68,1.54)";
                }
                // 回弹效果
                item.style.transition = time + "s " + bsr + " transform";
                damu.css(item, "translateX", targetX);
            } else {
                var translateX = damu.css(item, "translateX");
                if (translateX > 0) {
                    translateX = 0;
                } else if (translateX < minX) {
                    translateX = minX;
                }
                damu.css(item, "translateX", translateX);
                item.style.transition = "1s transform";
            }
        });
    }
})(window)