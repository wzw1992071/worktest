export default {
	data () {
		return {
			yuan: 0,
			yuan_percent: '元',
			percent:0,
			areaList: [
				{
					value: 0,
					label: '全部'
				},
				{
					value: 1,
					label: '青白江'
				},{
					value: 2,
					label: '海霸王'
				}
			],
			changeRules: [
				{
					markup_small: 0,
					markup_big: 0,
					val: 0,
					jiajian: 0,
					markup_type: 4,
				},
				{
					markup_small: 0,
					markup_big: 0,
					val: 0,
					jiajian: 1,
					markup_type: 3,
				}
			], // 改价区间需要用到的
			plusOrminus: [ 
				{
					value: 0,
					label: '减价'
				},
				{
					value: 1,
					label: '加价'
				}],
	   		yuanOrpercent: [{
					value: 4,
					label: '%'
				},
				{
					value: 3,
					label: '元'
			}],
			Shelfcolumns: [ // 上架或供应商的抬头
					{
						  type: 'selection',
						  align: 'center',
						  width: '7%',
						  title: '全选'
					  },
					  {
						  title: '供应商名称',
						  width: '10%',
						  align: 'center',
						  key: 'name',
						  render: (h, params) =>{
							  if (params.row.signing_type === 2) { ////1：未签约；2：店铺签约；3：商品签约
									  return h('div', [
									  h('i', {
										  'class' : {
											  'iconfont': true,
											  'icon-unfavourite': true
										  },
										  style: {
											  fontSize: '20px',
											  color: '#45c8dc',
											  marginRight: '5px'
										  }
									  }),
									  h('span', {
										  on: {
										  	click: ()=> {
												console.log('id', params.row.id)
												this.$store.state.shop_params.shop_id = params.row.id;
												this.$store.state.shopDetailModal = true;
											  },
											  mouseover: (e) => {
												  this.MouseHover (e, params.row.id);
											  },
											  mouseout: (evt) => {
												  this.MouseOut(evt);
											  }
										  }
									  }, params.row.name)
								  ]);
							  }
							  else {
									  return h('div', [
									  h('span', {
										  on: {
										  	  click: ()=> {
												console.log('id', params.row.id)
												this.$store.state.shop_params.shop_id = params.row.id;
												this.$store.state.shopDetailModal = true;
											  },
											  mouseover: (e) => {
												  this.MouseHover (e, params.row.id);
											  },
											  mouseout: (evt) => {
												  this.MouseOut(evt);
											  }
										  }
									  }, params.row.name)
								  ]);
							  }
						  }
					  },
					  {
						  //  1-5为铜 6-10为银 11-15为金 16-20为钻石
						  title: '店铺等级',
						  width: '9.4%',
						  align: 'center',
						  key: 'level',
						  render: (h, params) => {
							  if(params.row.level<= 5) { // 铜牌
								  var tongArr = new Array(params.row.level),len = tongArr.length;
								  for (var i=0;i<len;i++) {
									  tongArr[i] = i
								  }
								  return h('div', tongArr.map(function(){
									  return h('span', {
										  'class': {
														  'iconfont': true,
														  'tongpai': true
													  },
													  style: {
														  fontSize: '24px',
														  display: 'inline-block',
														  width: '24px',
														  height: '24px',
														  color: '#ff8400'
													  }
									  });
								  }));
							  }
							  // 银牌
							  else if (params.row.level> 5 && params.row.level<=10) {
								  var level = params.row.level-5;
								  console.log('level', level);
								  var yinArr = new Array(level),len = yinArr.length;
								  for (var i=0;i<len;i++) {
									  yinArr[i] = i
								  }
								  return h('div', yinArr.map(function(){
									  return h('span', {
										  'class': {
														  'iconfont': true,
														  'yinpai': true
													  },
													  style: {
														  fontSize: '24px',
														  display: 'inline-block',
														  width: '24px',
														  height: '24px',
														  color: '#ff8400'
													  }
									  });
								  }));
							  }
							  // 金牌
							  else if (params.row.level> 10 && params.row.level<=15) { 
								  var level = params.row.level-10;
								  var jinArr = new Array(level),len = jinArr.length;
								  for (var i=0;i<len;i++) {
									  jinArr[i] = i
								  }
								  return h('div', jinArr.map(function(){
									  return h('span', {
										  'class': {
														  'iconfont': true,
														  'jinpai': true
													  },
													  style: {
														  fontSize: '24px',
														  display: 'inline-block',
														  width: '24px',
														  height: '24px',
														  color: '#ff8400'
													  }
									  });
								  }));
							  }
							  else if (params.row.level> 15 && params.row.level<=20) {
								  var level = params.row.level-15;
								  var zuanArr = new Array(level),len = zuanArr.length;
								  for (var i=0;i<len;i++) {
									  zuanArr[i] = i
								  }
								  return h('div', zuanArr.map(function(){
									  return h('span', {
										  'class': {
														  'iconfont': true,
														  'zuanshi': true
													  },
													  style: {
														  fontSize: '24px',
														  display: 'inline-block',
														  width: '24px',
														  height: '24px',
														  color: '#ff8400'
													  }
									  });
								  }));
							  }
						  }
					  },
					  {
						  title: '发货地址',
						  align: 'center',
						  width: '7%',
						  key: 'market_name'
					  },
					  {
						  title: '服务评价',
						  width: '11%',
						  align: 'center',
						  key: 'service_num',
						  render: (h, params) => {
							  if(params.row.service_num %1 === 0) {
								  var service_evaluate_arr = new Array(params.row.service_num);
								  for (var i=0;i<service_evaluate_arr.length;i++) {
									  service_evaluate_arr[i] = i
								  }
								  return h('div', [
									  h('span', service_evaluate_arr.map(function(){
											  return h('span', [
												  h('Icon', {
													  'class': {
														  'iconfont': true,
														  'icon-xingxing-copy-copy-copy': true
													  },
													  style: {
														  fontSize: '20px',
														  color: '#ff8400'
													  }
												  }) 
											  ]);
									  })),
									  h('span', {
										  style: {
											  paddingLeft: '15px'
										  }
									  }, params.row.service_num)
								  ]); 
							  }
							 else {
								  var service_evaluate_arr2 = new Array(parseInt(params.row.service_num));
								  for (var i=0;i<service_evaluate_arr2.length;i++) {
									  service_evaluate_arr2[i] = i
								  }
								   return h('div', [
								  h('span', service_evaluate_arr2.map(function(){
										  return h('span', [
											  h('Icon', {
												  'class': {
													  'iconfont': true,
													  'icon-xingxing-copy-copy-copy': true
												  },
												  style: {
													  fontSize: '20px',
													  color: '#ff8400'
												  }
											  }) 
										  ]);
								  })),
								  h('span', [
									  h ('Icon', {
										  'class': {
											  'iconfont': true,
											  'icon-star-outline': true
										  },
										  style: {
													  fontSize: '20px',
													  color: '#ff8400'
												  }
									  })
								  ]),
								  h('span', {
									  style: {
										  paddingLeft: '15px'
									  }
								  }, params.row.service_num)
							  ]);
							 }
						  }
					  },
					  {
						  title: '发货速度',
						   width: '11%',
						  align: 'center',
						  key: 'send_num',
						  render: (h, params) => {
							  if(params.row.send_num %1 === 0) {
								  var delivery_speed_arr = new Array(params.row.send_num);
								  for (var i=0;i<delivery_speed_arr.length;i++) {
									  delivery_speed_arr[i] = i
								  }
								  return h('div', [
									  h('span', delivery_speed_arr.map(function(){
											  return h('span', [
												  h('Icon', {
													  'class': {
														  'iconfont': true,
														  'icon-xingxing-copy-copy-copy': true
													  },
													  style: {
														  fontSize: '20px',
														  color: '#ff8400'
													  }
												  }) 
											  ]);
									  })),
									  h('span', {
										  style: {
											  paddingLeft: '15px'
										  }
									  }, params.row.send_num)
								  ]); 
							  }
							 else {
								  var delivery_speed_arr2 = new Array(parseInt(params.row.send_num));
								  for (var i=0;i<delivery_speed_arr2.length;i++) {
									  delivery_speed_arr2[i] = i
								  }
								   return h('div', [
								  h('span', delivery_speed_arr2.map(function(){
										  return h('span', [
											  h('Icon', {
												  'class': {
													  'iconfont': true,
													  'icon-xingxing-copy-copy-copy': true
												  },
												  style: {
													  fontSize: '20px',
													  color: '#ff8400'
												  }
											  }) 
										  ]);
								  })),
								  h('span', [
									  h ('Icon', {
										  'class': {
											  'iconfont': true,
											  'icon-star-outline': true
										  },
										  style: {
													  fontSize: '20px',
													  color: '#ff8400'
												  }
									  })
								  ]),
								  h('span', {
									  style: {
										  paddingLeft: '15px'
									  }
								  }, params.row.send_num)
							  ]);
							 }
						  }
					  },
					  {
						  title: '商品总评',
						   width: '11%',
						  align: 'center',
						  key: 'goods_quality',
						  render: (h, params) => {
							  if(params.row.goods_quality %1 === 0) {
								  var goods_evaluate_arr = new Array(params.row.goods_quality);
								  for (var i=0;i<goods_evaluate_arr.length;i++) {
									  goods_evaluate_arr[i] = i
								  }
								  return h('div', [
									  h('span', goods_evaluate_arr.map(function(){
											  return h('span', [
												  h('Icon', {
													  'class': {
														  'iconfont': true,
														  'icon-xingxing-copy-copy-copy': true
													  },
													  style: {
														  fontSize: '20px',
														  color: '#ff8400'
													  }
												  }) 
											  ]);
									  })),
									  h('span', {
										  style: {
											  paddingLeft: '15px'
										  }
									  }, params.row.goods_quality)
								  ]); 
							  }
							 else {
								  var goods_evaluate_arr2 = new Array(parseInt(params.row.goods_quality));
								  for (var i=0;i<goods_evaluate_arr2.length;i++) {
									  goods_evaluate_arr2[i] = i
								  }
								   return h('div', [
								  h('span', goods_evaluate_arr2.map(function(){
										  return h('span', [
											  h('Icon', {
												  'class': {
													  'iconfont': true,
													  'icon-xingxing-copy-copy-copy': true
												  },
												  style: {
													  fontSize: '20px',
													  color: '#ff8400'
												  }
											  }) 
										  ]);
								  })),
								  h('span', [
									  h ('Icon', {
										  'class': {
											  'iconfont': true,
											  'icon-star-outline': true
										  },
										  style: {
													  fontSize: '20px',
													  color: '#ff8400'
												  }
									  })
								  ]),
								  h('span', {
									  style: {
										  paddingLeft: '15px'
									  }
								  }, params.row.goods_quality)
							  ]);
							 }
						  }
					  },
					  {
						  title: '销售品种',
						  align: 'center',
						  width: '11%',
						  key: 'brands',
						  render: (h, params) => {
							  return h ('div', [
								  h('span', {
								  }, params.row.goods_num+'种')
							  ]);
						  }
					  },
					  {
						  title: '自动上架供应商商品',
						  align: 'center',
						  width: '11%',
						  key: 'on_sale',
						  render: (h, params) => {
							  return h('div', [
								  h('i-switch', {
									  props: {
										  value: params.row.auto_on_sale,
										  size: 'default'
									  },
									  on: {
										  'on-change': () => {
											  this.switchChange(params.row.auto_on_sale,params.index, params.row.id);
										  }
									  }
								  })
							  ]);
						  }
					  },
					  {
						  title: '操作',
						  align: 'center',
						  key: 'shop_id',
						  render: (h, params) => {
							  return h('div', [
								  h('Button', {
									  props: {
										  size: 'small',
										  type: 'primary'
									  },
									  style: {
										  marginRight: '5px',
										  background: '#45c8dc',
										  borderColor: '#45c8dc',
										  fontSize: '14px'
									  },
									  on: {
										  click: () => {
											  this.remove(params.index, params.row.id);
										  }
									  }
								  }, '下架'), 
								  h('Button', {
									  props: {
										  size: 'small',
										  type: 'primary'
									  },
									  style :{
										  background: '#45c8dc',
										  borderColor: '#45c8dc',
										  fontSize: '14px'
									  },
									  on: {
										  click: () => {
											  this.changePriceModel = !this.changePriceModel;
											  this.changePrice(params.row.id);
										  }
									  }
								  }, '改价')
							  ]);
						  }
					  }
			],
			underShelfcolumns: [ // 下架或供应商的抬头
				{
						  type: 'selection',
						  align: 'center',
						  width: '7%',
						  title: '全选'
					  },
					  {
						  title: '供应商名称',
						  width: '10%',
						  align: 'center',
						  key: 'name',
						  render: (h, params) =>{
							  if (params.row.signing_type===2) { //1：未签约；2：店铺签约；3：商品签约
									  return h('div', [
									  h('i', {
										  'class' : {
											  'iconfont': true,
											  'icon-unfavourite': true
										  },
										  style: {
											  fontSize: '20px',
											  color: '#45c8dc',
											  marginRight: '5px'
										  }
									  }),
									  h('span', {
										  on: {
											//   mouseover: (e) => {
											// 	  this.MouseHover (e, params.row);
											//   },
											//   mouseout: (evt) => {
											// 	  this.MouseOut(evt);
											//   },
											  click: ()=> {
												console.log('id', params.row.id)
												this.$store.state.shop_params.shop_id = params.row.id;
												this.$store.state.shopDetailModal = true;
											  }
										  }
									  }, params.row.name)
								  ]);
							  }
							  else {
									  return h('div', [
									  h('span', {
										  on: {
											//   mouseover: (e) => {
											// 	  this.MouseHover (e, params.row);
											//   },
											//   mouseout: (evt) => {
											// 	  this.MouseOut(evt);
											//   },
											  click: ()=> {
												console.log('id', params.row.id)
												this.$store.state.shop_params.shop_id = params.row.id;
												this.$store.state.shopDetailModal = true;
												this.$store.state.shopDetailModal = true;
											  }
										  }
									  }, params.row.name)
								  ]);
							  }
						  }
					  },
					  {
						  //  1-5为铜 6-10为银 11-15为金 16-20为钻石
						  title: '店铺等级',
						  width: '9.4%',
						  align: 'center',
						  key: 'level',
						  render: (h, params) => {
							  if(params.row.level<= 5) { // 铜牌
								  var tongArr = new Array(params.row.level),len = tongArr.length;
								  for (var i=0;i<len;i++) {
									  tongArr[i] = i
								  }
								  return h('div', tongArr.map(function(){
									  return h('span', {
										  'class': {
														  'iconfont': true,
														  'tongpai': true
													  },
													  style: {
														  fontSize: '24px',
														  display: 'inline-block',
														  width: '24px',
														  height: '24px',
														  color: '#ff8400'
													  }
									  });
								  }));
							  }
							  // 银牌
							  else if (params.row.level> 5 && params.row.level<=10) {
								  var level = params.row.level-5;
								  console.log('level', level);
								  var yinArr = new Array(level),len = yinArr.length;
								  for (var i=0;i<len;i++) {
									  yinArr[i] = i
								  }
								  return h('div', yinArr.map(function(){
									  return h('span', {
										  'class': {
														  'iconfont': true,
														  'yinpai': true
													  },
													  style: {
														  fontSize: '24px',
														  display: 'inline-block',
														  width: '24px',
														  height: '24px',
														  color: '#ff8400'
													  }
									  });
								  }));
							  }
							  // 金牌
							  else if (params.row.level> 10 && params.row.level<=15) { 
								  var level = params.row.level-10;
								  var jinArr = new Array(level),len = jinArr.length;
								  for (var i=0;i<len;i++) {
									  jinArr[i] = i
								  }
								  return h('div', jinArr.map(function(){
									  return h('span', {
										  'class': {
														  'iconfont': true,
														  'jinpai': true
													  },
													  style: {
														  fontSize: '24px',
														  display: 'inline-block',
														  width: '24px',
														  height: '24px',
														  color: '#ff8400'
													  }
									  });
								  }));
							  }
							  else if (params.row.level> 15 && params.row.level<=20) {
								  var level = params.row.level-15;
								  var zuanArr = new Array(level),len = zuanArr.length;
								  for (var i=0;i<len;i++) {
									  zuanArr[i] = i
								  }
								  return h('div', zuanArr.map(function(){
									  return h('span', {
										  'class': {
														  'iconfont': true,
														  'zuanshi': true
													  },
													  style: {
														  fontSize: '24px',
														  display: 'inline-block',
														  width: '24px',
														  height: '24px',
														  color: '#ff8400'
													  }
									  });
								  }));
							  }
						  }
					  },
					  {
						  title: '发货地址',
						  align: 'center',
						  width: '7%',
						  key: 'market_name'
					  },
					  {
						  title: '服务评价',
						  width: '11%',
						  align: 'center',
						  key: 'service_num',
						  render: (h, params) => {
							  if(params.row.service_num %1 === 0) {
								  var service_evaluate_arr = new Array(params.row.service_num);
								  for (var i=0;i<service_evaluate_arr.length;i++) {
									  service_evaluate_arr[i] = i
								  }
								  return h('div', [
									  h('span', service_evaluate_arr.map(function(){
											  return h('span', [
												  h('Icon', {
													  'class': {
														  'iconfont': true,
														  'icon-xingxing-copy-copy-copy': true
													  },
													  style: {
														  fontSize: '20px',
														  color: '#ff8400'
													  }
												  }) 
											  ]);
									  })),
									  h('span', {
										  style: {
											  paddingLeft: '15px'
										  }
									  }, params.row.service_num)
								  ]); 
							  }
							 else {
								  var service_evaluate_arr2 = new Array(parseInt(params.row.service_num));
								  for (var i=0;i<service_evaluate_arr2.length;i++) {
									  service_evaluate_arr2[i] = i
								  }
								   return h('div', [
								  h('span', service_evaluate_arr2.map(function(){
										  return h('span', [
											  h('Icon', {
												  'class': {
													  'iconfont': true,
													  'icon-xingxing-copy-copy-copy': true
												  },
												  style: {
													  fontSize: '20px',
													  color: '#ff8400'
												  }
											  }) 
										  ]);
								  })),
								  h('span', [
									  h ('Icon', {
										  'class': {
											  'iconfont': true,
											  'icon-star-outline': true
										  },
										  style: {
													  fontSize: '20px',
													  color: '#ff8400'
												  }
									  })
								  ]),
								  h('span', {
									  style: {
										  paddingLeft: '15px'
									  }
								  }, params.row.service_num)
							  ]);
							 }
						  }
					  },
					  {
						  title: '发货速度',
						   width: '11%',
						  align: 'center',
						  key: 'send_num',
						  render: (h, params) => {
							  if(params.row.send_num %1 === 0) {
								  var delivery_speed_arr = new Array(params.row.send_num);
								  for (var i=0;i<delivery_speed_arr.length;i++) {
									  delivery_speed_arr[i] = i
								  }
								  return h('div', [
									  h('span', delivery_speed_arr.map(function(){
											  return h('span', [
												  h('Icon', {
													  'class': {
														  'iconfont': true,
														  'icon-xingxing-copy-copy-copy': true
													  },
													  style: {
														  fontSize: '20px',
														  color: '#ff8400'
													  }
												  }) 
											  ]);
									  })),
									  h('span', {
										  style: {
											  paddingLeft: '15px'
										  }
									  }, params.row.send_num)
								  ]); 
							  }
							 else {
								  var delivery_speed_arr2 = new Array(parseInt(params.row.send_num));
								  for (var i=0;i<delivery_speed_arr2.length;i++) {
									  delivery_speed_arr2[i] = i
								  }
								   return h('div', [
								  h('span', delivery_speed_arr2.map(function(){
										  return h('span', [
											  h('Icon', {
												  'class': {
													  'iconfont': true,
													  'icon-xingxing-copy-copy-copy': true
												  },
												  style: {
													  fontSize: '20px',
													  color: '#ff8400'
												  }
											  }) 
										  ]);
								  })),
								  h('span', [
									  h ('Icon', {
										  'class': {
											  'iconfont': true,
											  'icon-star-outline': true
										  },
										  style: {
													  fontSize: '20px',
													  color: '#ff8400'
												  }
									  })
								  ]),
								  h('span', {
									  style: {
										  paddingLeft: '15px'
									  }
								  }, params.row.send_num)
							  ]);
							 }
						  }
					  },
					  {
						  title: '商品总评',
						   width: '11%',
						  align: 'center',
						  key: 'goods_quality',
						  render: (h, params) => {
							  if(params.row.goods_quality %1 === 0) {
								  var goods_evaluate_arr = new Array(params.row.goods_quality);
								  for (var i=0;i<goods_evaluate_arr.length;i++) {
									  goods_evaluate_arr[i] = i
								  }
								  return h('div', [
									  h('span', goods_evaluate_arr.map(function(){
											  return h('span', [
												  h('Icon', {
													  'class': {
														  'iconfont': true,
														  'icon-xingxing-copy-copy-copy': true
													  },
													  style: {
														  fontSize: '20px',
														  color: '#ff8400'
													  }
												  }) 
											  ]);
									  })),
									  h('span', {
										  style: {
											  paddingLeft: '15px'
										  }
									  }, params.row.goods_quality)
								  ]); 
							  }
							 else {
								  var goods_evaluate_arr2 = new Array(parseInt(params.row.goods_quality));
								  for (var i=0;i<goods_evaluate_arr2.length;i++) {
									  goods_evaluate_arr2[i] = i
								  }
								   return h('div', [
								  h('span', goods_evaluate_arr2.map(function(){
										  return h('span', [
											  h('Icon', {
												  'class': {
													  'iconfont': true,
													  'icon-xingxing-copy-copy-copy': true
												  },
												  style: {
													  fontSize: '20px',
													  color: '#ff8400'
												  }
											  }) 
										  ]);
								  })),
								  h('span', [
									  h ('Icon', {
										  'class': {
											  'iconfont': true,
											  'icon-star-outline': true
										  },
										  style: {
													  fontSize: '20px',
													  color: '#ff8400'
												  }
									  })
								  ]),
								  h('span', {
									  style: {
										  paddingLeft: '15px'
									  }
								  }, params.row.goods_quality)
							  ]);
							 }
						  }
					  },
					  {
						  title: '销售品种',
						  align: 'center',
						  width: '11%',
						  key: 'brands',
						  render: (h, params) => {
							  return h ('div', [
								  h('span', {
								  }, params.row.goods_num+'种')
							  ]);
						  }
					  },
					  {
						  title: '操作',
						  align: 'center',
						  key: 'shop_id',
						  render: (h, params) => {
							  return h('div', [
								  h('Button', {
									  props: {
										  size: 'small',
										  type: 'primary'
									  },
									  style: {
										  marginRight: '5px',
										  background: '#45c8dc',
										  borderColor: '#45c8dc',
										  fontSize: '14px'
									  },
									  on: {
										  click: () => {
											  this.putOn(params.index, params.row.id);
										  }
									  }
								  }, '上架')
								//   h('Button', {
								// 	  props: {
								// 		  size: 'small',
								// 		  type: 'primary'
								// 	  },
								// 	  style :{
								// 		  background: '#45c8dc',
								// 		  borderColor: '#45c8dc',
								// 		  fontSize: '14px'
								// 	  },
								// 	  on: {
								// 		  click: () => {
								// 			  this.changePriceModel = !this.changePriceModel;
								// 			  this.changePrice(params.row.id);
								// 		  }
								// 	  }
								//   }, '改价')
							  ]);
						  }
					  }
			],
			updataTime: {
				time: '2012-12-12 10:10:10',
				new_time: ''
			},
			data: null,
			adjustParams: {
				info: {
					type: 4, //type:3.品牌(ids中传品牌)；4：供应商(ids中传供应商)；5：商品(ids中传商品)）
					range: 0, //0：部分；1：全部
					ids: [], //当range=1，为空数组
					search_info: [],
					on_type_three_ids: []
				}
			},
			adjustParams2: {
				type: 4, //type:3.品牌(ids中传品牌)；4：供应商(ids中传供应商)；5：商品(ids中传商品)）
				range: 0, //0：部分；1：全部
				on_ids: [],
				off_ids: [],
				ids: [], //当range=1，为空数组
				search_info: []
			},
			brand_adjust_params:{
				brand_ids: []
			},
			trans: null,
			changePrice_params: {
				info: {
					type: 4, //改价类型 1：服务商(全部二级分类,ids可为空)；2：分类(ids中传传two_type,three_ids中传three_type)；3.品牌(ids中传品牌)；4：供应商(ids中传供应商)；5：商品(ids中传商品)）
					range: 0, // 0部分， 1全部
					ids: [], // range=1,type=4/5时为空
					search_info: [],
				},
				markup_info: [
					{
						markup_type: 1
					}
				]
			},
			autoPutGoods_params: {
				type: 4, //自动上架新商品的类型（1：服务商(全部二级分类)；2：分类(只有分类才传no_type_three_ids，off_type_three_ids这两个字段，no_ids，off_ids传二级分类)；3.品牌；4：供应商；
				range: 1,
				on_ids: []
			},
			change_putOn: 0, //表示先改价上架同一步，调用上架的接口，默认分开
			switch1: true, //自动上传
			show_mask: true, // 开关按钮的遮罩
		};
	},
	methods: {
		closeChangeModal () { // 关闭改价弹窗
			this.noticeShow = true;
            this.changePriceModel = false;
		},
		areaChange (id) {
			this.params.area = id;
			this.getProviders();
		},
		requestSuccess(str) { //请求成功
			this.$Message.success({
				content: str,
				duration: 2
			});
		},
		requestError (str, reason) { //请求失败
			this.$Message.error({
				content: str+'失败，原因：'+reason,
				duration: 2
			});
		},
		selectMoreBrands (item) {
			this.brand_adjust_params.brand_ids = [];
            for (var it of item) {
                this.brand_adjust_params.brand_ids.push(it.id);
			}
		},
		requestWarn (str) { //请求失败
			this.$Message.warning({
				content: str,
				duration: 2
			});
		},
		getProviders () { // 获得服务商
			this.$Loading.start();
			if (!this.params.area) {
				var transParams = JSON.parse(JSON.stringify(this.params));
				delete transParams.area;
				window.req.getProvidersList(this, transParams, res => {
					if(res.code === 0) {
						this.data =  res.data;
						this.$Loading.error();
					}
				});
			}
			else {
				window.req.getProvidersList(this, this.params, res => {
					if(res.code === 0) {
						this.data =  res.data;
						this.$Loading.error();
					}
				});
			}
		},
		putOn (index, id) { // 点击列表中上架按钮，不做数据交互
			this.adjustParams.info.ids = [];
			this.adjustParams.info.ids.push(id);
			this.trans = index;
            this.noticeShow = true;
        },
		//    与设置参数有关的
	   selectMore (arr) { // 表头多选框 上架下架多选框
			arr.length !=0 ? this.show_mask = false: this.show_mask = true;
            this.adjustParams.info.ids = [];
            for (var it of arr) {
                this.adjustParams.info.ids.push(it.id);
			}
			this.changePrice_params.info.ids = this.adjustParams.info.ids;
	   },
	//    下架多个时，需要的验证
		putDownMore () { // 下架
			if (this.adjustParams.info.ids.length === 0) {
				this.requestWarn('请先选择下架的店铺');
			}
			else {
				 this.$Loading.start();
				window.req.putProvidersDown(this, this.adjustParams, res => {
					if (res.code === 0) {
						this.$Loading.error();
						this.requestSuccess('供应商下架成功');
						for (var id of this.adjustParams.info.ids) {
							for (var index in this.data.shops) {
								if (id ===  this.data.shops[index].id) this.data.shops.splice(index, 1)
							}
						}
						this.adjustParams.info.ids = [];
					}
					else this.requestError('供应商下架', res.message);
				});
			}
		},
		// 上架多个时，需要验证
		putOnmore () { //上架
			if (this.adjustParams.info.ids.length === 0) {
				this.requestWarn('请先选择上架的店铺');
			}
			else {
				this.noticeShow = true;
			}
		},
		putOnmoreSure () { //上架多个验证通过时，发生数据请求.or不改价直接上架
			// this.adjustParams.info.ids = [];
			this.noticeShow = false;
			this.$Loading.start();
			window.req.putProvidersOn(this, this.adjustParams, res => {
				if (res.code === 0) {
					this.$Loading.error();
					for(var id of this.adjustParams.info.ids) {
						for(var i in this.data.shops) {
							if(this.data.shops[i].id === id) this.data.shops.splice(i, 1)
						}
					}
					if(this.adjustParams.info.type == 2) this.requestSuccess('分类上架成功');
					else if (this.adjustParams.info.type == 4)this.requestSuccess('供应商上架成功');
				}
				else this.requestError('上架', res.message);
			});
		},
		changePriceMore () {
			if (this.adjustParams.info.ids.length === 0) this.requestWarn('请先选择改价的店铺');
			else this.changePriceModel = true;
		},
		providerPageChange (e) { // 反页
			this.params.page = e;
			this.$Loading.start();
			window.req.getProvidersList(this, this.params, res => {
				if(res.code === 0) {
					this.data =  res.data;
					this.$Loading.error();
				}
			});
		},
		yuanPlus () { // 加价弹窗中按元加价
			this.yuan ++;
		},
		yuanMinus () { // 加价弹窗中按元减价
			this.yuan -- ;
		},
		percentPlus () { // 加价弹窗中按百分比加价
			this.percent ++;
		},
		percentMinus () {	// 加价弹窗中按百分比减价
			this.percent --;
		},
		addRuler () { // 添加区间改价规则
			var num = {
				markup_small: 0,
				markup_big: 0,
					val: 0,
					jiajian: 0,
					markup_type: 3
			};
			this.changeRules.push(num);
		},
		rangeDelete (index) { //按区间改价中删除一行
            this.changeRules.splice(index, 1);
		},
		yuan_percent_change (val) { // 显示元还是%
			val === 'baifen'? this.yuan_percent = '%': this.yuan_percent = '元';
		},
		// 商品有关
		getGoodsType: function () {
			let _this = this;
			this.$Loading.start();
			window.req.getGoodsTree(this, {is_sale: 2}, (req)=>{
				if(req.code == 0){
					this.$Loading.error();
					let fourth = [];
					let typeList = [];

					this.typeTree = req.data;

					for(let firstIndex in req.data){
						let firstChildren = [];

						for(let secondIndex in req.data[firstIndex]){
							if(typeof req.data[firstIndex][secondIndex] == 'object'){
								let secondChildren = [];

								for(let thirdIndex in req.data[firstIndex][secondIndex]){
									if(typeof req.data[firstIndex][secondIndex][thirdIndex] == 'object'){
										secondChildren.push({expand: true, title: '<p>'+req.data[firstIndex][secondIndex][thirdIndex].type_name+'<span style="display: none">'+req.data[firstIndex][secondIndex][thirdIndex].type_id+'</span></p>'});

										for(let fourthIndex in req.data[firstIndex][secondIndex][thirdIndex]){
											if(typeof req.data[firstIndex][secondIndex][thirdIndex][fourthIndex] == 'object'){
												req.data[firstIndex][secondIndex][thirdIndex][fourthIndex].pid = thirdIndex;
												fourth.push(req.data[firstIndex][secondIndex][thirdIndex][fourthIndex]);
											}
										}

									}
								}

								firstChildren.push({expand: false, title: '<p>'+req.data[firstIndex][secondIndex].type_name+'<span style="display: none">'+req.data[firstIndex][secondIndex].type_id+'</span></p>', children: secondChildren});
							}
						}

						typeList.push({expand: true, title: '<p>'+req.data[firstIndex].type_name+'<span style="display: none">'+req.data[firstIndex].type_id+'</span></p>', children: firstChildren});
					}

					this.typeData = typeList;
					this.typeBtnData = fourth;
				}else{
					_this.$Message.error(req.message);
				}
			});
		},
		getGoodsType2: function (params) {
			let _this = this;
			this.$Loading.start();
			window.req.getGoodsTree(this, params, (req)=>{
				if(req.code == 0){
					this.$Loading.error();
					let fourth = [];
					let typeList = [];
					let typeList2 = [];
					this.typeTree = req.data;

					for(let firstIndex in req.data){
						let firstChildren = [];
						let firstChildren2 = [];
						for(let secondIndex in req.data[firstIndex]){
							if(typeof req.data[firstIndex][secondIndex] == 'object'){
								let secondChildren = [];
								for(let thirdIndex in req.data[firstIndex][secondIndex]){
									if(typeof req.data[firstIndex][secondIndex][thirdIndex] == 'object'){
										secondChildren.push({expand: true, title: '<p>'+req.data[firstIndex][secondIndex][thirdIndex].type_name+'<span style="display: none">'+req.data[firstIndex][secondIndex][thirdIndex].type_id+'</span></p>'});
										for(let fourthIndex in req.data[firstIndex][secondIndex][thirdIndex]){
											if(typeof req.data[firstIndex][secondIndex][thirdIndex][fourthIndex] == 'object'){
												req.data[firstIndex][secondIndex][thirdIndex][fourthIndex].pid = thirdIndex;
												fourth.push(req.data[firstIndex][secondIndex][thirdIndex][fourthIndex]);
											}
										}

									}
								}

								firstChildren.push({expand: false, title: '<p>'+req.data[firstIndex][secondIndex].type_name+'<span style="display: none">'+req.data[firstIndex][secondIndex].type_id+'</span></p>'});
								firstChildren2.push({expand: false, title: '<p>'+req.data[firstIndex][secondIndex].type_name+'<span style="display: none">'+req.data[firstIndex][secondIndex].type_id+'</span></p>', children: secondChildren});
							}
						}

						typeList.push({expand: true, title: '<p>'+'全部商品'+'<span style="display: none">'+req.data[firstIndex].type_id+'</span></p>', children: firstChildren});
						typeList2.push({expand: true, title: '<p>'+req.data[firstIndex].type_name+'<span style="display: none">'+req.data[firstIndex].type_id+'</span></p>', children: firstChildren2});
						
					}
					this.typeData = typeList;
					this.typeData2 = typeList2;
					this.typeBtnData = fourth;
				}else{
					_this.$Message.error(req.message);
				}
			});
		},
		// 获得商品
		getProducts () {
			this.$Loading.start();
			window.req.getProducts(this, this.params, res => {
				if (res.code === 0) {
					this.data = res.data;
					this.$Loading.error();
				}
				else this.$Loading.error();
			})
		},
		produactPageChange (e) {
			// console.log('this.params',this.params);
			// this.params.type_ids.push(this.treeid)
			this.params.page = e;
			this.getProducts();
		},
		productsMouseover (evt,item) { // 鼠标放在商品上面，显示商品的上传时间
			this.updataTime.time = item.on_sale_time;
			var priceInfo = document.getElementById('dcm_price_info');
			priceInfo.style.display = 'block';
			priceInfo.style.top=evt.clientY+ 'px';
			priceInfo.style.left=evt.clientX+ 'px';
		},
		MouseOut () {
			var priceInfo = document.getElementById('dcm_price_info');
			priceInfo.style.display = 'none';
		},
		getChangePriceDetail () {
			// delete this.other_params.info;
			this.$Loading.start();
			window.req.getChangePriceDetail (this, this.changeDetail, res => {
				if (res.code == 0) {
					this.$Loading.error();
					  this.hoverData =  res.data;
					var obj = {val:this.hoverData.all_change.val, typeName: '元'}
					  if(this.hoverData.all_change.type ===1) { //元
						this.hoverData.all_change2 = [];
						obj.typeName = '元'; this.hoverData.all_change2.push(obj)
					  }
					  else if(this.hoverData.all_change.type ===2) {
						this.hoverData.all_change2 = [];
						obj.typeName = '%'; this.hoverData.all_change2.push(obj)
					  }
					  for(var item2 of this.hoverData.info_change) {
						if (item2.type === 3) {
							item2 = Object.assign(item2, {typeName: '元'})
						}
						else {
							item2 = Object.assign(item2, {typeName: '%'})
						}
					  }
				}
				console.log('hoverData', this.hoverData)
			})
		},
		yuanChange () { // 按元加价
			this.changePrice_params.markup_info[0].price = this.yuan;
			this.submitChangePrice();
			this.changePriceModel = false;
		},
		percentChange () {
			this.changePrice_params.markup_info[0].percent = this.percent;
			this.submitChangePrice();
			this.changePriceModel = false;
		},
		rangeChange () { // 区间改价
			for (var item of this.changeRules) {
				if(item.markup_type === 4) {
					item.jiajian ? item = Object.assign(item, {percent: item.val}) : item = Object.assign(item, {percent: 0-item.val})
				}
				else item.jiajian ? item = Object.assign(item, {price: item.val}) : item = Object.assign(item, {price: 0-item.val})
			}
			this.changePrice_params.markup_info = [];
			this.changePrice_params.markup_info = this.changeRules;
			console.log(this.changePrice_params)
			this.submitChangePrice ();
		},
		changePrice (id) {
			// this.trans = index;
			if (this.isUnder === 'not') {this.isUnder = 1;} // 若为为上架供应商直接改价，也调用上架的接口
			console.log('改价的id', id)
			this.changePrice_params.info.type = 4; //4代表供应商
			this.changePrice_params.info.ids = [];
			this.changePrice_params.info.ids.push(id);
			this.changePriceModel = true;
		},
		submitChangePrice () { // 提交改价信息
			this.$Loading.start();
			// this.changePrice_params.info.ids = this.adjustParams.info.ids;
			if(this.change_putOn || this.isUnder ===1) { // 掉用上架接口
				console.log('改价调用的上架接口，便是先改价之后直接上架')
				window.req.putProvidersOn(this, this.changePrice_params, res => {
					if (res.code === 0) {
						 this.$Loading.error();
						this.requestSuccess('改价成功');this.changePriceModel = false;
						// 如果是新商品改价，改价之后，默认上架
						if(this.changePrice_params.info.type === 5) { // 商品列表中，删去
							var leftNodes = document.getElementsByName('btnChecked');
							for(let i = 0; i<leftNodes.length; i++){
								leftNodes[i].className = 'checked';
								leftNodes[i].children[0].className = 'icon icon-checked';
							}
							if (this.isOnPut) {this.getProducts()}
							if(!this.isOnPut) {
								for(var index in this.data.goods) {
									for(var id of this.changePrice_params.info.ids) {
										if (this.data.goods[index].id === id) this.data.goods.splice(index, 1);
									}
								}
							}
						}
						if (this.changePrice_params.info.type === 4 && !this.isOnPut) { // 如果是未上架的供应商改价，直接上架
							for(var index in this.data.shops) {
								for(var id of this.changePrice_params.info.ids) {
									if (this.data.shops[index].id === id) this.data.shops.splice(index, 1);
								}
							}
	
						}
						this.changePrice_params.info.ids =[];
					}
					else this.requestError('改价', res.message)
				})
			}
			else {
				console.log('已上架的东西，调用改价接口')
				this.$Loading.start();
				window.req.changePrice(this, this.changePrice_params, res => {
					if (res.code === 0) {
						this.$Loading.error();
						this.requestSuccess('改价成功');this.changePriceModel = false;
						// 如果是新商品改价，改价之后，默认上架
						if(this.changePrice_params.info.type === 5) { // 商品列表中，删去
							var leftNodes = document.getElementsByName('btnChecked');
							for(let i = 0; i<leftNodes.length; i++){
								leftNodes[i].className = 'checked';
								leftNodes[i].children[0].className = 'icon icon-checked';
							}
							if (this.isOnPut) {this.getProducts()}
							if(!this.isOnPut) {
								for(var index in this.data.goods) {
									for(var id of this.changePrice_params.info.ids) {
										if (this.data.goods[index].id === id) this.data.goods.splice(index, 1);
									}
								}
							}
						}
						if (this.changePrice_params.info.type === 4 && !this.isOnPut) { // 如果是未上架的供应商改价，直接上架
							for(var index in this.data.shops) {
								for(var id of this.changePrice_params.info.ids) {
									if (this.data.shops[index].id === id) this.data.shops.splice(index, 1);
								}
							}

						}
						this.changePrice_params.info.ids =[];
					}
					else this.requestError('改价', res.message)
				})
			}
		},
		beforeAutoPutGoods2 () {
			if(this.adjustParams.info.type === 4 && this.adjustParams.info.ids.length === 0) {
				this.requestWarn('请选择自动上架商品的供应商')
			}
			else if (this.adjustParams.info.type === 2 && this.adjustParams.info.on_type_three_ids.length == 0) {
				console.log('123', this.adjustParams, 123)
			}
		},
		beforeAutoPutGoods (e){
			if (e) this.autoPutGoods ();
		},
		autoPutGoods () {
			// 自动上架商品
			this.$Loading.start();
			this.adjustParams2.on_ids = this.adjustParams.info.ids;
			window.req.autoPutPrividersGoods(this, this.adjustParams2, res => {
				if (res.code === 0)  {this.requestSuccess('自动上架新商品成功'); this.$Loading.error(); }
					else this.requestError('自动上架新商品', res.message)
			})
		},
		putGoods () {
			this.$Loading.start();
			window.req.putProvidersOn(this, this.adjustParams, res =>{
				if (res.code === 0) {
					this.$Loading.error();
					var leftNodes = document.getElementsByName('btnChecked');
					for(let i = 0; i<leftNodes.length; i++){
						leftNodes[i].className = 'checked';
						leftNodes[i].children[0].className = 'icon icon-checked';
					}
					if(this.adjustParams.info.ids.length > 1) {
						for(var index in this.data.goods) {
							for(var id of this.adjustParams.info.ids) {
								if (this.data.goods[index].id === id) this.data.goods.splice(index, 1);
							}
						}
					} 
					else {
						this.data.goods.splice(this.index, 1);
					}
					
					this.requestSuccess('商品上架成功');
					this.adjustParams.info.ids = [];
				}
				else this.requestError('商品上架', res.message)
			})
		},
		put () {
			this.adjustParams.info.ids.push(this.$store.state.shop_params.shop_id);
			this.$Loading.start();
            // console.log('123',this.adjustParams, this.$store.state.shop_params.shop_id)
            window.req.putProvidersOn(this, this.adjustParams, res => {
                if (res.code === 0) {this.requestSuccess('供应商上架成功'); this.$Loading.error();}
                else this.requestError('供应商上架', res.message);
            })
		},
		putDown () {
			this.$Loading.start();
			this.adjustParams.info.ids.push(this.$store.state.shop_params.shop_id);
			window.req.putProvidersDown(this, this.adjustParams, res => {
				if (res.code === 0) {
					this.$Loading.error();
					this.requestSuccess('供应商下架成功');
					for (var id of this.adjustParams.info.ids) {
						for (var index in this.data.shops) {
							if (id ===  this.data.shops[index].id) this.data.shops.splice(index, 1)
						}
					}
					this.adjustParams.info.ids = [];
				}
				else this.requestError('供应商下架', res.message);
			});
		},
		setTopOrder () { //商品品牌的置顶排序
			window.req.setTopOrder(this, this.topParams, res => {
				if (res.code ===0) this.requestSuccess('设置置顶排序成功')
				else this.requestError('设置置顶排序', res.message)
			})

		},
		showGoodsDetail (id) { //点击商品，出现商品详情
			console.log(id)
			this.$store.state.goodsDetailModal = true;
			this.$store.state.goods_params.id = id
		},
	
	}
};