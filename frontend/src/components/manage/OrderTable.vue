<template>
  <div>
    <b-table :items="items" :fields="fields" striped responsive="sm">
      <template #cell(訂單狀態)="row">
        <span v-if="row.item.訂單狀態 == 0" class="text-success">{{ status[row.item.訂單狀態] }}</span>
        <span v-else-if="row.item.訂單狀態 == 1" class="text-info">{{ status[row.item.訂單狀態] }}</span>
        <span v-else-if="row.item.訂單狀態 == 2" class="text-warning">{{ status[row.item.訂單狀態] }}</span>
        <span v-else-if="row.item.訂單狀態 == 3" class="text-primary">{{ status[row.item.訂單狀態] }}</span>
        <span v-else-if="row.item.訂單狀態 == 5" class="text-danger">{{ status[row.item.訂單狀態] }}</span>
        <span v-else>{{ status[row.item.訂單狀態] }}</span>
      </template>
      <template #cell(評分)="row">
        <div class="star">
            <div class='starXin' v-for="(item,index) in list" :key='index'>
                <img :src="row.item.ratingStar>index?stara:starb" />
            </div>
        </div>
      </template>
      <template #cell(顯示更多)="row">
        <b-button size="sm" @click="show(row);" class="mr-2 detail">
          {{ row.detailsShowing ?  'Hide' : 'Show'}} Details
        </b-button>
      </template>

      <template #row-details="row">
        <b-card>
          <div class="row"> 客戶暱稱: {{row.item.clientName}}</div>
          <!-- <div class="row">  -->
          <div class='container row'>
            <div class='col-md-4'>
                  <b-row class="mb-2" v-for= "(data,index) in row.item.datas " :key="index">
                      <b-row class="mr-2">{{ data.product_name }}</b-row>
                      <b-row class="mr-2">* {{ data.quantity }} =</b-row>
                      <b-row v-bind:class="{'line-throughdisplay':data.discount<1}" class="mr-2">{{ data.price*data.quantity }}</b-row>
                      <b-row v-if="data.discount<1" class="mr-2"> {{price(data)}} </b-row>
                      <b-row v-if="data.discount<1" class="mr-2 discount pl-1 pr-1"> {{data.discount*10}}折</b-row>
                  </b-row>
            </div>
            <div class='col-md-2 align-self-end'>
                <b-row class="mb-2 justify-content-end">
                  <b-row>運費：</b-row>
                  <b-row v-bind:class="{'line-throughdisplay':row.item.isShippingCoupon,'mr-2':row.item.isShippingCoupon}">{{ row.item.fee }}</b-row>
                  <b-row v-if='row.item.isShippingCoupon' class="mb-2">0</b-row>
                </b-row>
                <b-row class="mb-2 justify-content-end">
                  <b-row>總金額：{{ total(row.item.datas) }}</b-row>
                </b-row>
            </div>
            <div class='col-md-6'>
                <div class='row justify-content-center'>
                  <textarea :id="'text'+row.index" :placeholder="items[row.index].comment" class='tA' :readonly="items[row.index].readonly"></textarea>
                  <div :id ="'disabled-wrapper'+row.index" class="d-inline-block sb row">
                    <b-button class="te col-md-9" :disabled="items[row.index].ratingdisabled" variant='primary' @click="submitRating(row)">{{row.item.msg}}</b-button>
                    <b-button class="cancel col-md-3" :disabled="items[row.index].ratingdisabled" variant='danger' @click="cancelOrder(row)">取消</b-button>
                  </div>
                  <b-tooltip v-if="items[row.index].isFinish" :target="'disabled-wrapper'+row.index">已完成</b-tooltip>
                </div>
            </div>
          </div>
        </b-card>
      </template>
    </b-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list:[0,1,2,3,4],
        stara:'https://i.imgur.com/S1EjjXA.png',//亮星星
        starb:'https://i.imgur.com/gONraUA.png',//暗星星
        status: ['已下單','店家已確認','準備中','運送中','已完成','已取消'],
        fields: ['訂單編號', '下單日期', '訂單狀態', '評分', '顯示更多'],
        items: [
          { 
              id:0,
              seller_id:0,
              ratingStar:3,
              readonly:true,
              ratingdisabled:false,
              comment:"不要加奶茶",
              訂單編號: '3', 下單日期: '2020-01-07 08:00:00',
              運輸時間:'null',地址:'null',訂單狀態:0,
              msg:'下一步:店家已確認',
              isFinish:false,
              fee:0,
              isShippingCoupon:false,
              clientName:'Roger',
              datas:[
                  {product_name:'玩火Passion Tea', price:50, quantity:2,discount:1},
              ]
          }, 
        ],
      }
    },
    methods:{
      price(data){
        return parseFloat(data.price * data.quantity * data.discount).toFixed(0)
      },
      total(datas){
        let total=0;
        if(datas!=undefined)
          for(let i=0;i<datas.length;i++) total=total+parseFloat(parseFloat(datas[i].price * datas[i].quantity * datas[i].discount).toFixed(0))
        return total
      },
      submitRating(history){
        var index = history.index
        this.$confirm("確定要更改狀態為"+ this.status[this.items[index].訂單狀態+1],"","question").then(() => {
          this.items[index].訂單狀態 += 1;
          if ( this.items[index].訂單狀態 == 4){
            this.items[index].msg = '已完成'
            this.items[index].isFinish = true
            this.items[index].ratingdisabled=!this.items[index].ratingdisabled
          }
          else{
            this.items[index].msg = '下一步：'+ this.status[this.items[index].訂單狀態+1]
            this.items[index].isRated = true
            this.items[index].readonly = true
          }
        this.$http.post('/seller/orders/update',{id:history.item.訂單編號, order:{status:history.item.訂單狀態}}, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters['auth/token']
        }
        }).then(response=>{
          this.$alert("更改成功","","success");
        }).catch(error =>{
          // console.log(error.response)
        })
        })
        // this.items[index].ratingdisabled=!this.items[index].ratingdisabled
      },
      cancelOrder(history){
        var index = history.index
        this.$confirm("您確定要取消訂單嗎？","","warning").then(() => {
          this.items[index].訂單狀態 =5;
          this.items[index].msg = '已取消'
          this.items[index].isFinish = true
          this.items[index].ratingdisabled=!this.items[index].ratingdisabled
            this.$http.post('/seller/orders/update',{id:history.item.訂單編號, order:{status:history.item.訂單狀態,}}, {
          headers: {
            'Authorization': 'Bearer ' + this.$store.getters['auth/token']
          }
          }).then(response=>{
            this.$alert("取消成功","","success");
          }).catch(error =>{
          // console.log(error.response)
        })
        })
      },
      show(history){
        this.$http.get('/seller/orders/'+history.item.訂單編號, {
          headers: {
            'Authorization': 'Bearer ' + this.$store.getters['auth/token']
          }
        }).then(response=>{
          let data=response.data;
          history.item.comment=data.order.comment
          history.item.clientName=data.order.name
          history.item.fee=data.order.fee
          if(history.item.訂單狀態==4)
            {
              history.item.isFinish = true
              history.item.ratingdisabled=!history.item.ratingdisabled
              history.item.msg=this.status[history.item.訂單狀態]
            }
          else if(history.item.訂單狀態==5)
          {
            history.item.msg = '已取消'
            history.item.isFinish = true
            history.item.ratingdisabled=!history.item.ratingdisabled
          }
          else history.item.msg='下一步:'+this.status[history.item.訂單狀態+1]
          history.item.datas=[]
          // console.log(history.item)
          for(let i=0 ;i<data.order_items.length;i++)
          {
            let discount = 1
            if(data.coupon_items!=undefined) {
              for (let j =0;j<data.coupon_items.length;j++){
              if(data.coupon_items[j].product_id == data.order_items[i].product_id && data.coupon_items[j].quantity<=data.order_items[i].quantity) {
                discount=data.order.discount}}}
            history.item.datas.push({product_name: data.order_items[i].product_name, price: data.order_items[i].price, quantity: data.order_items[i].quantity, discount: discount})
          }
          history.toggleDetails()

        }).catch(error =>{
          // console.log(error.response)
        })
      }
    },
  computed:{
    
  },
  created(){
    this.$http.get('/seller/orders', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters['auth/token']
        }
      })
      .then(response => {
          this.items=[];
          let data=response.data;
          // console.log(data)
          for (let i=0;i<data.length;i++)
          {
            this.items.push({訂單編號: data[i].order_id,ratingStar: data[i].stars, 下單日期: data[i].order_time, 訂單狀態: data[i].status,readonly: true, ratingdisabled:false});
          }
          this.items.sort(function(a,b){
            return a.訂單狀態 - b.訂單狀態;
            });
      })
      .catch(error => {
        this.$router.push('/')
      });
    },
  }
</script>

<style scoped>
  pre{
    margin: 0;
    font-size: 16px;
  }
  .discount{
    background-color: yellow;
    font-weight: bold;
  }
  .line-throughdisplay{
    text-decoration:line-through;
    text-decoration-color:red;
    color: rgba(0,0,0,.4);
  }
  .star{
      width: 1%;
      height: 1%;
      display: flex;
  }
  img{
    width: 25px;
    height: 25px;
  }
  .starXin{
      height: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      line-height: 20px;
  }
  .row{
    margin: 0;
    padding: 0;
  }
  .sb{
    width:85%;
    height:43px;
    margin-top: 1%;
    border-radius:4px;
  }
  .te{
      width:100%;
      height: 100%;
      /* background:rgba(67,154,255,1); */
      border-radius:0px;
      font-size:15px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(254,254,254,1);
  }
  .cancel{
      width:100%;
      height: 100%;
      border-radius:0px;
      font-size:15px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(254,254,254,1);
  }
  textarea{
      width:85%;
      resize: none;
      height:120px;
      background:rgba(246,246,246,1);
      border-radius:6px;
      font-size:15px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:21px;
  }
</style>