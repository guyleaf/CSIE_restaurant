<template>
    <b-form>
        <b-form-group label="取餐方式：" label-for="taking_method">
          <b-form-radio-group v-model="takingMethodSelected" @change="onChange" :options="takingMethods"></b-form-radio-group>
        </b-form-group>

        <b-form-group v-if="takingMethodSelected == 0" label="碰面地點:" label-for="payment" >
          <b-form-radio-group
            id="radio-group-1"
            v-model="placeSelected"
            @change="onChange"
            :options="places"
            name="radio-options"
         ></b-form-radio-group>
        </b-form-group>

        <b-form-group v-if="takingMethodSelected == 0" v-slot="{ ariaDescribedby }">
          <div class="inSchool" v-if="placeSelected=='school'">
             <b-form-select v-model="schoolPlaceSelected" :state="schoolPlaceSelectedState" @change="onChange" :options="schoolPlaces"></b-form-select>
          </div>
          <div class="outside" v-if="placeSelected=='outside'" >
            <div class="row placetxt"> 您的地點：</div>
            <b-form-radio-group
              class="rdb"
              id="btn-radios-3"
              v-model="addressSelected"
              :options="address"
              :aria-describedby="ariaDescribedby"
              button-variant="outline-dark"
              buttons
              stacked
              @change="onChange"
            ></b-form-radio-group>
            <div class="adb">
              <b-icon animation="cylon" variant="secondary" @mouseleave="adHover=false" v-if="adHover" icon="plus-circle-fill" font-scale="3" @click="addAddress"/>
              <b-icon variant="secondary" @mouseover="adHover=true" v-else icon="plus-circle" font-scale="3" @click="addAddress"/>
            </div>
          </div>
        </b-form-group>
        <b-modal
          id="modal-prevent-closing"
          ref="modal"
          title="新增地址"
          @show="resetModal"
          @hidden="resetModal"
          @ok="handleAddress"
          centered
        >
          <form ref="form" @submit.prevent="handleAddress">
            <b-form-group
              label="您的地址："
              label-for="name-input"
              :state="addressState"
            >
              <b-form-input
                id="name-input"
                v-model="newAddress"
                :state="addressState"
                required
              ></b-form-input>
            </b-form-group>
          </form>
        </b-modal>

        <b-form-group label="支付方式：" label-for="payment">
          <b-form-radio-group v-model="paymentMethodSelected" @change="onChange" :options="paymentMethods"></b-form-radio-group>
        </b-form-group>
        <b-form-group>
          <b-input-group-prepend v-if="paymentMethodSelected==0">
            <b-form-select class="col-11" v-model="creditCardSelected" @change="onChange" :state="creditCardselectedState" :options="creditCards_options"></b-form-select>
            <b-button class="creditCard col-1" size="sm" text="Button" variant="success" @click="addCreditCard" squared>+</b-button>
          </b-input-group-prepend>
        </b-form-group>
        <b-modal
          id="modal-credit-card"
          ref="credit"
          title="新增信用卡"
          @show="resetModal"
          @hidden="resetModal"
          @ok="handleCreditCard"
          centered
        >
          <form ref="credit_form" @submit.stop.prevent="handler2">
            <b-form-group
              label="您的信用卡卡號："
              label-for="name-input2"
              :state="creditCardState"
            >
              <b-input-group>
                <b-input-group-prepend is-text>
                  <b-icon icon="credit-card"></b-icon>
                </b-input-group-prepend>
                <b-form-input
                  id="name-input2"
                  v-model="creditCard"
                  :state="creditCardState"
                  :formatter="formatter"
                  @input="checkCreditCardValidity"
                  required
                ></b-form-input>
                <b-form-invalid-feedback :state="creditCardState">
                  Invalid credit card number.
                </b-form-invalid-feedback>
              </b-input-group>
            </b-form-group>
            <b-form-group
              label="到期日："
              label-for="name-input3"
              :state="expiredDateState"
            >
            <b-input-group class="outer">
              <b-input-group-prepend is-text>
                  <b-icon icon="calendar2-date" size="sm"></b-icon>
              </b-input-group-prepend>
              <datepicker wrapper-class="datepicker" :state="expiredDateState" @input="checkCreditCardValidity" minimum-view="month" name="uniquename" required clear-button v-model="expiredDate" format="MM/yy" typeable></datepicker>
            </b-input-group>
            <b-alert v-if="expiredDateState!=null&&!expiredDateState&&creditCardState!=null&&creditCardState" show variant="danger">請選擇有效日期</b-alert>
            <b-alert v-if="expiredDateState!=null&&!expiredDateState&&creditCardState!=null&&!creditCardState" show variant="danger">請選擇有效日期、有效卡號</b-alert>
            <b-alert v-if="expiredDateState!=null&&expiredDateState&&creditCardState!=null&&!creditCardState" show variant="danger">請輸入有效卡號</b-alert>
            </b-form-group>
          </form>
        </b-modal>
        
        <b-form-group label="優惠碼:" label-for="coupon">
            <div class='tlprice' id='coupon'>
            <b-input-group
                size="md"
                class="mb-3"
                >
            <b-form-input id="coupon-input" v-model="coupon" :placeholder="prompt" :state="couponState" :readonly="couponState" aria-describedby='coupon-error' trim></b-form-input>
            <b-input-group-append >
              <b-button size="sm" v-if="couponState==null || !couponState" id="coupon_submit" text="Button" variant="success" @click="checkCoupon(coupon)">使用</b-button>
              <b-button size="sm" v-else id="coupon_submit" text="Button" variant="success" @click="modifyCoupon">修改</b-button>
            </b-input-group-append>
            <b-form-invalid-feedback id='coupon-error' class='error_msg'>
                  {{errorMessage}}
           </b-form-invalid-feedback>
          </b-input-group>
        </div>
        </b-form-group>
    </b-form>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';

export default {
  name: "Cashier",
  components: {
    Datepicker
  },
  props: {
    totalPrice: Number
  },
  data(){
      return {
        coupon: null,
        couponState: null,
        prompt:'請輸入優惠卷',
        bookingShopName: null,
        CouponItems:[],
        placeSelected:'school',
        schoolPlaceSelected:'請選擇地點',
        schoolPlaceSelectedState: null,
        addressSelected: '0',
        ItemList:[],
        places:[
          { text: "北科大校內", value: "school" },
          { text: "校外地址", value: "outside" },
        ],
        schoolPlaces:[
          { text: "請選擇地點", value: "請選擇地點", disabled:true},
          { text: "綜合科館正門口", value: "綜合科館正門口"},
          { text: "共同科館門口", value: "共同科館門口"},
          { text: "中正館側門口", value: "中正館側門口"},
          { text: "第一教學大樓", value: "第一教學大樓"},
          { text: "第二教學大樓", value: "第二教學大樓"},
          { text: "第三教學大樓", value: "第三教學大樓"},
          { text: "第四教學大樓", value: "第四教學大樓"},
          { text: "第五教學大樓", value: "第五教學大樓"},
          { text: "第六教學大樓", value: "第六教學大樓"},
        ],
        paymentMethods: [
          {text: "信用卡", value: 0},
          {text: "現金支付", value: 1}
        ],
        address:[],
        disCountMoney:null,
        popoverShow: false,
        errorMessage: '',
        adHover:false,
        newAddress: '',
        addressState: null,
        paymentMethodSelected: 0,
        creditCardSelected: '-1',
        creditCard: '',
        creditCardState: null,
        creditCards: [],
        creditCards_options: [
          {text: "請選擇信用卡", value: -1, disabled: true}
        ],
        creditCardselectedState: null,
        expiredDate: '',
        expiredDateState: null,
        takingMethodSelected: 0,
        takingMethods: [
          {text: "外送", value: 0},
          {text: "自取", value: 1}
        ],
        productNum:null,
        total_price: this.totalPrice
      }
  },
  methods:{
    formatter(value){
      value = value.split("-").join("");
      value = value.match(new RegExp('.{1,4}$|.{1,4}', 'g')).join("-");
      return value
    },
    onChange(){
      let address = null;
      let coupon_code = null;
      let payment_method = null;
      let credit_card = null;

      if (this.takingMethodSelected == 0)
      {
        if (this.placeSelected === 'school')
          address = this.schoolPlaceSelected
        else if (this.placeSelected === 'outside')
          address = this.addressSelected;
        
        if (this.placeSelected === 'school' && address == '請選擇地點')
          this.schoolPlaceSelectedState = false;
        else
          this.schoolPlaceSelectedState = true;
      }

      if (this.couponState)
        coupon_code = this.coupon

      payment_method = this.paymentMethodSelected;

      if (this.paymentMethodSelected == 0)
      {
        if (this.creditCardSelected != '-1')
        {
          this.creditCardselectedState = true;
          credit_card = this.creditCards[this.creditCardSelected];
        }
        else
          this.creditCardselectedState = false;
      }
      this.$bus.$emit('sync', {address:address, payment_method:payment_method, coupon_code:coupon_code, credit_card_info:credit_card, taking_method: 1})
    },
    school(){
    },
    addAddress(){
      this.$refs['modal'].show();
    },
    addCreditCard(){
      this.$refs['credit'].show();
    },  
    setPriceToCookie(){
      this.$cookie.set('beforePrice',this.beforePrice)
      this.$cookie.set('totalPrice',this.total_price)
    },
    getProductInfo(){
      this.ItemList = [];
      this.total_price = 0;
      this.productNum = 0;
      let data = JSON.parse(this.$cookie.get("product"));
      for (var i = 0; i<data.length;i++)
      {
        this.beforePrice = this.total_price + data[i].foodPrice*data[i].quantity; 
        this.total_price = this.beforePrice
        this.ItemList.push({foodName:data[i].foodName, quantity:data[i].quantity, foodPrice:data[i].foodPrice, id:data[i].id});
        this.productNum += this.ItemList[i].quantity
      }
    },
    getCouponState(){
      let coupon = JSON.parse(this.$cookie.get('coupon'));
      if(coupon != null)
        {
          this.coupon = coupon.coupon.code;
          this.useValidCoupon()
          this.useCouponDiscount(coupon)
          this.$cookie.set('discount',Math.round(this.disCountMoney))
        }
    },
    addCutomerAddress(data){
      this.$axios.post(this.$url + '/customer/address', {address:data},  {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters['auth/token']
        }
      }).then(response =>{
        // console.log(response.data);
      })
    },
    getCutomerAddress(){
      this.$http.get('/customer/address',  {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters['auth/token']
        }
      }).then(response =>{
        for (let i = 0; i<response.data.length; i++){
          this.address.push({text:response.data[i].address, value:response.data[i].address})
        }
        this.addressSelected = this.address[0].value;
      })
    },
    useCouponDiscount(coupon){
        this.disCountMoney = 0;
        let products = JSON.parse(this.$cookie.get('product'))
        if (coupon.coupon.type == 0){
          this.$emit('unFee')
        }
        else if (coupon.coupon.type == 1)
        {
          this.disCountMoney = Math.floor(this.beforePrice * (1-coupon.coupon.discount));
          this.totalPrice = Math.round(this.totalPrice * coupon.coupon.discount);
        }
        else if (coupon.coupon.type == 2)
        {
          for (let i = 0 ; i<coupon.coupon_items.length; i++){
            let product = products.filter(j => j.id == coupon.coupon_items[i].product_id)
            this.disCountMoney += coupon.coupon_items[i].quantity * coupon.coupon.discount * product[0].foodPrice 
          }
          this.total_price -= this.disCountMoney;
        }
      },
    checkCoupon(coupon){
        if (coupon == '')
        {
          this.couponState = false;
          this.errorMessage = '優惠券欄位不能為空';
          return
        }
        let id = this.$cookie.get('shopId');
        let orderItems = this.$cookie.get('product')
        let data = { coupon_code:coupon,seller_id:id,orderItems:orderItems,total_price:this.beforePrice}
        this.$http.post('/customer/coupon/use',data , {
          headers: {
            'Authorization': 'Bearer ' + this.$store.getters['auth/token']
          }
        })
        .then(response =>{
          this.$confirm('輸入優惠券後無法更改商品，欲修改商品請先移除優惠券。','使用說明','warning').then(()=>{
            this.useValidCoupon()
            this.useCouponDiscount(response.data.coupon)
            this.$cookie.set('coupon',JSON.stringify(response.data.coupon))
            this.$cookie.set('discount',Math.round(this.disCountMoney))
            this.$alert('','輸入成功','success')
            this.$emit('useCoupon')
          })
        })
        .catch(error => {
          // console.log(error.response)
          this.couponState = false
          this.errorMessage = error.response.data.message
        })
      },
    useValidCoupon(){
      this.lockChagneButton()
      this.couponState = true;
    },
    lockChagneButton(){
      this.$bus.$emit("lockbutton")
    },
    unlockChangeButton(){
      this.$bus.$emit("unlockbutton")
    },
    modifyCoupon(){
      this.deleteCoupon()
    },
    deleteCoupon(){
      let coupon_input = document.querySelector('#coupon-input')
      this.couponState = null;
      this.disCountMoney = null;
      this.total_price = this.beforePrice
      this.setPriceToCookie()
      this.unlockChangeButton()
      document.cookie = 'coupon=; expires=Thu, 01 Jan 1970 00:00:00 GMT'; 
      document.cookie = 'discount=; expires=Thu, 01 Jan 1970 00:00:00 GMT'; 
      this.$emit('deleteCoupon')
    },
    addCustomerCreditCard(credit_card, expire_date){
      // console.log(credit_card)
      // console.log(expire_date)
      this.$axios.post(this.$url + '/customer/creditCard', {credit_card:credit_card, expire_date:moment(expire_date).format("YYYY-MM-DD")},  {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters['auth/token']
        }
      }).then(response =>{
        // console.log(response.data);
      })
    },
    getCustomerCreditCard(){
      this.$http.get('/customer/creditCard',  {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters['auth/token']
        }
      }).then(response =>{
        // console.log(response.data)
        for (let i = 0; i<response.data.length; i++){
          this.creditCards_options.push({text:response.data[i].credit_card + '   ' + '有效期限:' + moment(response.data[i].expire_date).format("MM/YY"), value:i})
          this.creditCards.push({credit_card: response.data[i].credit_card, expire_date:response.data[i].expire_date})
        }
      }).catch(error => {
        // console.log(error)
      });
    },
    checkAddressValidity() {
      const valid = this.$refs.form.checkValidity()
      this.addressState = valid
      return valid
    },
    checkCreditCardValidity() {
      let credit_card = this.creditCard.split("-").join("");
      if (credit_card.length == 16 && !isNaN(credit_card))
        this.creditCardState = true;
      else
        this.creditCardState = false;

      if (this.expiredDate)
        this.expiredDateState = true;
      else
        this.expiredDateState = false;
      return this.creditCardState && this.expiredDateState
    },
    resetModal() {
      this.newAddress = ''
      this.addressState = null
      this.creditCard = ''
      this.creditCardState = null
      this.expiredDate = ''
      this.creditCardselectedState = null
      this.schoolPlaceSelectedState = null
    },
    handleCreditCard(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handler2()
    },
    handler2() {
      if (!this.checkCreditCardValidity())
        return
      for (let i = 0 ; i<this.creditCards.length; i++){
        if(this.creditCard == this.creditCards[i].credit_card){
          this.$alert("重複的信用卡，請重新輸入","","warning")
          this.creditCardState = false 
          return
        }
      }
      this.addCustomerCreditCard(this.creditCard, this.expiredDate);
      this.creditCards_options.push({text:this.creditCard + '   ' + '有效期限:' + moment(this.expiredDate).format("MM/YY"), value:this.creditCards_options.length-1})
      this.creditCards.push({credit_card: this.creditCard, expire_date:this.expiredDate})
      this.$nextTick(() => {
        this.$alert("信用卡新增成功", "", "success")
        this.$bvModal.hide('modal-credit-card')
      })
    },
    handleAddress(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handler1()
    },
    handler1() {
      if (!this.checkAddressValidity()) {
        return
      }
      for (let i = 0 ; i<this.address.length; i++){
        if(this.newAddress == this.address[i].value){
          this.$alert("重複的地址，請重新輸入","","warning")
          this.addressState = false 
          return
        }
      }
      this.addCutomerAddress(this.newAddress)
      this.address.push(this.newAddress)
      this.$nextTick(() => {
        this.$alert("地址新增成功", "", "success")
        this.$bvModal.hide('modal-prevent-closing')
      })
    }
  },
  watch: {
    $route: {
      handler: function() {
        this.getCouponState();
       }
    }
  },
  mounted(){
    this.$bus.$on('modifySpin',(beforePrice,totalPrice) => {
      this.beforePrice = beforePrice;
      this.totalPrice = totalPrice;
    })
    this.$bus.$on('deleteCell',(beforePrice,totalPrice) => {
      this.beforePrice = beforePrice;
      this.totalPrice = totalPrice;
    })
  },
  created(){
    this.getProductInfo();
    this.getCouponState();
    this.getCutomerAddress();
    this.getCustomerCreditCard();
    this.$bus.$on('checkAll', () => {
      if (this.paymentMethodSelected == 0 || this.takingMethodSelected == 0)
      {
        if (this.paymentMethodSelected == 0 && this.creditCardSelected == '-1')
          this.creditCardselectedState = false;

        if (this.takingMethodSelected == 0 && this.placeSelected === 'school' && this.schoolPlaceSelected == '請選擇地點')
          this.schoolPlaceSelectedState = false;

        if ((this.paymentMethodSelected == 0 && !this.creditCardselectedState) || (this.takingMethodSelected == 0 && this.placeSelected === 'school' && !this.schoolPlaceSelectedState))
          return;
      }
      
      this.$bus.$emit('submit');
    });
  }
}
</script>

<style scoped>
  .adb{
    margin: 2%;
    text-align:center;
  }
  .rdb{
    width: 100%;
  }
  .placetxt{
    margin-bottom: 1%;
  }
  .outside{
    margin: 2%;
  }
  .creditCard{
    font-size: 1.2rem;
  }
  .outer{
    margin-bottom: 10px;
  }
</style>