let activitySlice = {
    'sow_date': new Date('2022-04-01'),
    'harvest_date': new Date('2022-09-01'),
    'campaign_end_date': new Date('2022-06-01'),
    'campaign_start_date': new Date('2022-01-01')
};

let assignedCostItems = {
    'item_cost': 20000,
    'date_used': new Date('2021-12-01'),
    'category': 'semilla'
};

let paymentPolicy = [[75, "$sow_date-15"], [25, "$sow_date+15"]];

function extractDynamicDate (dynamicDate) {

    let pattern = /\$(?<period>harvest_date|sow_date|campaign_start_date|campaign_end_date)(?<op>\-|\+)(?<days>\d+)/g;
    let regex = new RegExp(pattern)
    let myArray = regex.exec(dynamicDate);
    return myArray

};

function validatePaymentPolicy (paymentPolicy) {

    let isListOfLen2 = paymentPolicy.every(function (t) {
        return t.length === 2
    });

    let isFirstInt = paymentPolicy.every(function (t) {
        return typeof(t[0]) === 'number'
    });

    let isSecondIntOrString = paymentPolicy.every(function (t) {
        
        let boolean = typeof(t[1]) === 'number' || typeof(t[1]) === 'string'
        return boolean
    });

    let sum = 0
    paymentPolicy.forEach(t => {
        sum += t[0]
    });

    let sumToAHundred = sum === 100;

    if (isSecondIntOrString && isListOfLen2) {
        for (let i = 0; i < paymentPolicy.length; i++) {
            let _ = extractDynamicDate(paymentPolicy[i][1])
        }
    };

    if (!isListOfLen2) {
        return [isListOfLen2, 'isListOfLen2']
    };

    if (!isFirstInt) {
        return [isFirstInt, 'isFirstInt']
    };

    if (!isSecondIntOrString) {
        return [isSecondIntOrString, 'isSecondIntOrString']
    };

    if (!sumToAHundred) {
        return [sumToAHundred, 'sumToAHundred']
    };

    return [true, '']
};

function createCashFlow (activitySlice, assignedCostItems, paymentPolicy) {

    let cashFlow = [];
    let totalCost = assignedCostItems['item_cost'];
    
    
    
    for(let i = 0; i< paymentPolicy.length; i++){
      let fraction = paymentPolicy[i][0];
      let dynamicDate = paymentPolicy[i][1];
      let paymentCost = fraction / 100*totalCost;
      let paymentDate;
      
      if(typeof dynamicDate == 'number'){
        dateUsed = assignedCostItems['date_used'];
        
        paymentDate = new Date()
        paymentDate.setDate(dateUsed.getDate() + dynamicDate);
        
      }
      if(typeof dynamicDate == 'string'){
        dynamicDate = extractDynamicDate(dynamicDate);
        let op = dynamicDate[2];
        let days = dynamicDate[3];
        let period = dynamicDate[1];
        
        
        if(op == '+'){
          let dateUsed = activitySlice[period];
          paymentDate = new Date();
          paymentDate.setDate(dateUsed.getDate() + days);
        }
        if(op == '-'){
          let dateUsed = activitySlice[period];
          paymentDate = new Date();
          paymentDate.setDate(dateUsed.getDate() - days);

        }
      }
    
    cashFlow.push([paymentDate, paymentCost]);
    }
  return cashFlow;

};
