var myChart1;
var myChart2;
var option1;
var option2;
var dateArray = [];

      $(function(){
				$(function(){
					myChart1 = echarts.init(document.getElementById("echarts-user"));


					option1 = {
					    tooltip : {
					        trigger: 'item',
					        formatter: "{a} <br/>{b} : {c} ({d}%)"
					    },
					    legend: {
					        orient : 'vertical',
					        x : 'left',
					        data:['ios','web','android']
					    },
					    toolbox: {
					    	color:'#f8f8f8',
					        show : true,
					        feature : {
					            mark : {show: true},
					            dataView : {show: true, readOnly: false},
					            magicType : {
					                show: true, 
					                type: ['pie', 'funnel'],
					                option: {
					                    funnel: {
					                        x: '25%',
					                        width: '50%',
					                        funnelAlign: 'left',
					                        max: 1548
					                    }
					                }
					            },
					            restore : {show: true},
					            saveAsImage : {show: true}
					        }
					    },
					    calculable : true,
					    color:['#5ab1ef', '#b6a2de','#f0b4aa'],
					    series : [
					        {
					            name:'访问来源',
					            type:'pie',
					            radius : '55%',
					            center: ['50%', '60%'],
					        }
					    ]
					};
	                myChart1.setOption(option1);
               });
				
				$(function(){
					myChart2 = echarts.init(document.getElementById("echarts-scatter"));
					
					option2 =
						 {
						    tooltip : {
						        trigger: 'axis',
						        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
						            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
						        }
						    },
						    legend: {
						        data:['ios','web','android']
						    },
						    color:['#5ab1ef','#f0b4aa', '#b6a2de'],
						    grid: {
						        left: '1%',
						        right: '2.5%',
						        bottom: '3%',
						        containLabel: true
						    },
						    xAxis : [
						        {
						            type : 'category',
                                    splitLine: {show:false},
                                    name:'日期',
									data :
									   function () {
                                           var myDate = new Date(); //获取今天日期
                                           myDate.setDate(myDate.getDate() - 9);
                                           var dateTemp;
                                           var flag = 1;
                                           for (var i = 0; i < 10; i++) {
                                           		// if(parseInt(myDate.getMonth()<10)){
                                                    dateTemp =myDate.getFullYear()+"-"+'0'+(myDate.getMonth()+1)+"-"+myDate.getDate();
                                                // }
                                               // dateTemp =myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
                                               dateArray.push(dateTemp);
                                               myDate.setDate(myDate.getDate() + flag);
                                           }
                                        return dateArray;
                                    }()
						        }
						    ],
						    yAxis : [
						        {
						            type : 'value',
									name:'访问量'
						        }
						    ],
						    series : [
						        {
						            name:'ios',
						            type:'bar',
						        },
						        {
						            name:'android',
						            type:'bar',
						        },
						        {
						            name:'web',
						            type:'bar',
						        }
						    ]
						};
					 myChart2.setOption(option2);
					 					
				});
                    loadLoginData(9);
			});

function loadLoginData(count) {
    //查询10天的数据
    //     var count = 9;
		var totalIos=0;
		var totalAndroid=0;
		var totalWeb=0;
		var iosArray = [];
		var androidArray =[];
		var webArray = [];
		var dateArray1 = [];
        $.get("restful/platFormLoginData/getDayData", {count: count}, function (data) {
            var records = JSON.parse(data.content);
            $.each(records, function (i, r) {
                iosArray.push(records[i].iosCount);
                androidArray.push(records[i].androidCount);
                webArray.push(records[i].webCount);
                dateArray1.push(records[i].dataTime);
            })
            option2.xAxis[0].data = dateArray1;
            for (var i in option2.series) {
                if (option2.series[i].name == 'ios') {
                    option2.series[i].data = iosArray;
                }
                if (option2.series[i].name == 'android') {
                    option2.series[i].data = androidArray;
                }
                if (option2.series[i].name == 'web') {
                    option2.series[i].data = webArray;
                }
            }
            myChart2.setOption(option2);

            for (var i in iosArray) {
                totalIos += iosArray[i];
            }
            for (var i in androidArray) {
                totalAndroid += androidArray[i];
            }
            for (var i in webArray) {
                totalWeb += webArray[i];
            }
            option1.series[0].data = [
                {value: totalIos, name: 'ios'},
                {value: totalWeb, name: 'web'},
                {value: totalAndroid, name: 'android'}
            ]
            myChart1.setOption(option1);
        })
}

function loadLoginDataForYear(count) {
    var iosArray1=[];
    var androidArray1=[];
    var webArray1=[];
    var dateArray2 = [];
    var totalIos1=0;
    var totalAndroid1=0;
    var totalWeb1=0;
    $.get("restful/platFormLoginData/getYearData", {count: count}, function (data) {
        var records = JSON.parse(data.content);
        $.each(records,function (i,r) {
            iosArray1.push(records[i].iosCount);
            androidArray1.push(records[i].androidCount);
            webArray1.push(records[i].webCount);
            dateArray2.push(records[i].dataTime);
        })
        option2.xAxis[0].data = dateArray2;
        for (var i in option2.series) {
            if (option2.series[i].name == 'ios') {
                option2.series[i].data = iosArray1;
            }
            if (option2.series[i].name == 'android') {
                option2.series[i].data = androidArray1;
            }
            if (option2.series[i].name == 'web') {
                option2.series[i].data = webArray1;
            }
        }
        myChart2.setOption(option2);
        for (var i in iosArray1) {
            totalIos1 += iosArray1[i];
        }
        for (var i in androidArray1) {
            totalAndroid1 += androidArray1[i];
        }
        for (var i in webArray1) {
            totalWeb1 += webArray1[i];
        }
        option1.series[0].data = [
            {value: totalIos1, name: 'ios'},
            {value: totalWeb1, name: 'web'},
            {value: totalAndroid1, name: 'android'}
        ]
        myChart1.setOption(option1);
    })
}

function loadLoginDataForMonth(count) {
    var iosArray2=[];
    var androidArray2=[];
    var webArray2=[];
    var dateArray3 = [];
    var totalIos2=0;
    var totalAndroid2=0;
    var totalWeb2=0;
    $.get("restful/platFormLoginData/getMonthData", {count: count}, function (data) {
        var records = JSON.parse(data.content);
        $.each(records,function (i,r) {
            iosArray2.push(records[i].iosCount);
            androidArray2.push(records[i].androidCount);
            webArray2.push(records[i].webCount);
            dateArray3.push(records[i].dataTime);
        })
        option2.xAxis[0].data = dateArray3;
        for (var i in option2.series) {
            if (option2.series[i].name == 'ios') {
                option2.series[i].data = iosArray2;
            }
            if (option2.series[i].name == 'android') {
                option2.series[i].data = androidArray2;
            }
            if (option2.series[i].name == 'web') {
                option2.series[i].data = webArray2;
            }
        }
        myChart2.setOption(option2);
        for (var i in iosArray2) {
            totalIos2 += iosArray2[i];
        }
        for (var i in androidArray2) {
            totalAndroid2 += androidArray2[i];
        }
        for (var i in webArray2) {
            totalWeb2 += webArray2[i];
        }
        option1.series[0].data = [
            {value: totalIos2, name: 'ios'},
            {value: totalWeb2, name: 'web'},
            {value: totalAndroid2, name: 'android'}
        ]
        myChart1.setOption(option1);
    })
}

 $('#yearLoginCount').off().on('click', function() {
      $(":input[name='yearCount']").checked = true;
      $(":input[name='dayCount']").removeAttr("checked");
      $(":input[name='monthCount']").removeAttr("checked");
	 $('#yearLi').removeClass('hide').show();
     $('#yearLi').val(0);
     // $('#yearLi option:first').attr("selected","selected");
     $('#monthLi').hide();
     $('#dayLi').hide();
     loadLoginDataForYear(1);//最近2年的数据
 })

$('#monthLoginCount').off().on('click', function() {
    $(":input[name='monthCount']").checked = true;
    $(":input[name='dayCount']").removeAttr("checked");
    $(":input[name='yearCount']").removeAttr("checked");
    $('#yearLi').hide();
    $('#dayLi').hide();
    $('#monthLi').removeClass('hide').show();
    $('#monthLi').val(0);
    // $('#monthLi option:first').attr("selected","selected");
    loadLoginDataForMonth(4); //最近5个月的数据
})

$('#dayLoginCount').off().on('click', function() {
    $(":input[name='dayCount']").checked = true;
    // $("#dayLi option[value='0']").selected=true;
    $(":input[name='monthCount']").removeAttr("checked");
    $(":input[name='yearCount']").removeAttr("checked");
    $('#dayLi').show();
    $('#dayLi').val(0);
    // $('#dayLi option:first').attr("selected","selected");
    $('#yearLi').hide();
    $('#monthLi').hide();
    loadLoginData(9);   //最近10天的数据
})

$('#yearLi').change(function () {
    var p1=$(this).children('option:selected').val();
    if(p1 == "0"){
        loadLoginDataForYear(1);//最近2年的数据
    }else if(p1 == "1"){
        loadLoginDataForYear(2);//最近3年的数据
    }else if(p1 == "2"){
        loadLoginDataForYear(4);//最近5年的数据
    }
})

$('#monthLi').change(function () {
    var p1=$(this).children('option:selected').val();
    if(p1 == "0"){
        loadLoginDataForMonth(4);//最近5个月的数据
    }else if(p1 == "1"){
        loadLoginDataForMonth(6);//最近7个月的数据
    }else if(p1 == "2"){
        loadLoginDataForMonth(8);//最近9个月的数据
    }else if(p1 == "3"){
        loadLoginDataForMonth(9); //最近10个月的数据
	}else if(p1 == "4"){
        loadLoginDataForMonth(11);//最近12个月的数据
	}
})

$('#dayLi').change(function () {
    var p1=$(this).children('option:selected').val();
    if(p1 == "0"){
        loadLoginData(9);//最近10天的数据
    }else if(p1 == "1"){
        loadLoginData(14);//最近15天的数据
    }else if(p1 == "2"){
        loadLoginData(19);//最近20天的数据
    }else if(p1 == "3"){
        loadLoginData(24); //最近25天的数据
    }else if(p1 == "4"){
        loadLoginData(29);//最近30天的数据
    }
})