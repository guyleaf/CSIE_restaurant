(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-52cde8f8"],{"30fb":function(t,e,a){"use strict";a("71bb")},"371d":function(t,e,a){},"71bb":function(t,e,a){},"74ae":function(t,e,a){},9352:function(t,e,a){"use strict";a("bbaf")},"9c82":function(t,e,a){"use strict";a("ccff")},bb51:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"home"},[a("Carousel",{attrs:{imgPath1:"https://picsum.photos/1024/480/?image=54",imgPath2:"https://picsum.photos/1024/480/?image=12",imgPath3:"https://picsum.photos/1024/480/?image=22"}}),a("center",[a("div",{staticClass:"container row justify-content-center cardMargin"},[a("div",{staticClass:"col-10"},[a("b-card",[a("div",{staticClass:"row"},[a("div",{staticClass:"col-2"},[a("Checkbox",{on:{selectChange:t.updateSelected}})],1),a("div",{staticClass:"col-10"},[a("ShopCardGroup",{attrs:{tag:t.selected}})],1)])])],1)])])],1)},o=[],i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("b-card",{attrs:{"border-variant":"light"}},[a("div",{staticClass:"cardHeader"},[a("h3",[t._v(t._s(t.tagName))])]),a("b-card-group",{staticClass:"ml-0 mr-0 card-columns",attrs:{deck:""}},t._l(t.cards,(function(e){return a("ShopCard",t._b({key:e.shopId,attrs:{tag:t.tag}},"ShopCard",e,!1))})),1)],1)},n=[],r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.inArray()?a("div",[a("b-card",{staticClass:"mb-2",staticStyle:{"max-width":"20rem"},attrs:{title:t.shopName,"img-src":t.imgPath,"img-alt":"Image","img-top":"",tag:"article"}},[a("b-card-text",[t._v(t._s(t.shopDescription))]),a("b-button",{attrs:{variant:"light"}},[a("router-link",{staticClass:"link",attrs:{to:{name:"Shop"}}},[t._v("GO TO SHOP")])],1)],1)],1):t._e()},h=[],c={name:"ShopCard",props:{tag:Array,shopTag:String,shopName:String,imgPath:String,shopDescription:String},methods:{inArray:function(){if(void 0==this.tag[0])return!0;for(var t=0;t<this.tag.length;t++)if(this.shopTag==this.tag[t])return!0;return!1}}},p=c,l=(a("9352"),a("2877")),u=Object(l["a"])(p,r,h,!1,null,null,null),d=u.exports,m={name:"ShopCardGroup",props:{tag:Array},components:{ShopCard:d},data:function(){return{cards:[{shopId:0,shopName:"ShopRon",imgPath:"",shopDescription:"11111111",shopTag:"Ron"},{shopId:1,shopName:"ShopPan",imgPath:"",shopDescription:"878787878",shopTag:"Pan"},{shopId:2,shopName:"ShopLeaf",imgPath:"",shopDescription:"7777777",shopTag:"Leaf"},{shopId:3,shopName:"ShopLee",imgPath:"",shopDescription:"0000000",shopTag:"Lee"},{shopId:4,shopName:"ShopRon",imgPath:"",shopDescription:"11111111",shopTag:"Ron"},{shopId:5,shopName:"ShopPan",imgPath:"",shopDescription:"878787878",shopTag:"Pan"},{shopId:6,shopName:"ShopLeaf",imgPath:"",shopDescription:"7777777",shopTag:"Leaf"},{shopId:7,shopName:"ShopLee",imgPath:"",shopDescription:"0000000",shopTag:"Lee"},{shopId:8,shopName:"ShopRon",imgPath:"",shopDescription:"11111111",shopTag:"Ron"},{shopId:9,shopName:"ShopPan",imgPath:"",shopDescription:"878787878",shopTag:"Pan"},{shopId:10,shopName:"ShopLeaf",imgPath:"",shopDescription:"7777777",shopTag:"Leaf"},{shopId:11,shopName:"ShopLee",imgPath:"",shopDescription:"0000000",shopTag:"Lee"},{shopId:12,shopName:"ShopRon",imgPath:"",shopDescription:"11111111",shopTag:"Ron"},{shopId:13,shopName:"ShopPan",imgPath:"",shopDescription:"878787878",shopTag:"Pan"},{shopId:14,shopName:"ShopLeaf",imgPath:"",shopDescription:"7777777",shopTag:"Leaf"}]}},computed:{tagName:function(){if(void 0==this.tag[0])return"All";for(var t=this.tag[0],e=1;e<this.tag.length;e++)t=t+"+"+this.tag[e];return t}}},g=m,f=(a("fe0c"),Object(l["a"])(g,i,n,!1,null,null,null)),b=f.exports,v=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container style1"},[a("div",{staticClass:"row "},[t._m(0),a("div",{staticClass:"col-md-7 carouselStyle",staticStyle:{}},[a("b-carousel",{staticStyle:{"text-shadow":"0px 0px 2px #000"},attrs:{id:"carousel-fade",fade:"",indicators:"","img-width":"1024","img-height":"480"}},[a("b-carousel-slide",{attrs:{caption:"First slide","img-src":t.imgPath1}}),a("b-carousel-slide",{attrs:{caption:"Second Slide","img-src":t.imgPath2}}),a("b-carousel-slide",{attrs:{caption:"Third Slide","img-src":t.imgPath3}})],1)],1)])])},S=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"col-md-5 flex"},[a("h1",[t._v("渴望享受美食嗎？立即訂餐。")]),a("p",[t._v("搜尋最愛的餐廳、料理或餐點。")])])}],P={name:"Carousel",props:{shopName:String,imgPath1:String,imgPath2:String,imgPath3:String,shopDescription:String}},C=P,_=(a("9c82"),Object(l["a"])(C,v,S,!1,null,"ef775d66",null)),x=_.exports,N=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("b-form-group",{attrs:{label:"商店種類","label-class":"checkboxHeader"}},[a("div",{staticClass:"checkboxMenu row mt-1"},t._l(t.options,(function(e){return a("b-form-checkbox",{key:e.value,staticClass:"mb-1 checkbox",attrs:{value:e.value,button:"","button-variant":"none"},on:{change:function(e){return t.onChange()}},model:{value:t.selected,callback:function(e){t.selected=e},expression:"selected"}},[t._v(" "+t._s(e.text)+" ")])})),1)])],1)},T=[],D={name:"Checkbox",data:function(){return{selected:[],options:[{text:"Ron",value:"Ron"},{text:"Pan",value:"Pan"},{text:"Leaf",value:"Leaf"},{text:"Lee",value:"Lee"}]}},methods:{onChange:function(){this.$emit("selectChange",this.selected)}}},L=D,I=(a("30fb"),Object(l["a"])(L,N,T,!1,null,null,null)),k=I.exports,w={name:"home",components:{Carousel:x,Checkbox:k,ShopCardGroup:b},methods:{updateSelected:function(t){this.selected=t}},data:function(){return{selected:[]}}},y=w,R=(a("e5e1"),Object(l["a"])(y,s,o,!1,null,null,null));e["default"]=R.exports},bbaf:function(t,e,a){},ccff:function(t,e,a){},e5e1:function(t,e,a){"use strict";a("371d")},fe0c:function(t,e,a){"use strict";a("74ae")}}]);