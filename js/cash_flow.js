let activity_slice = {
    'sow_date': new Date('2022-04-01'),
    'harvest_date': new Date('2022-09-01'),
    'campaign_end_date': new Date('2022-06-01'),
    'campaign_start_date': new Date('2022-01-01')
};

let assigned_cost_items = {
    'item_cost': 20000,
    'date_used': new Date('2021-12-01'),
    'category': 'semilla'
};

let payment_policy = [[75, "$sow_date-15"], [25, "$sow_date+15"]];

function extract_dynamic_date (dynamic_date) {

    let pattern = /\$(?<period>harvest_date|sow_date|campaign_start_date|campaign_end_date)(?<op>\-|\+)(?<days>\d+)/g;
    let regex = new RegExp(pattern)
    let myArray = regex.exec(dynamic_date);
    return myArray

};

function validate_payment_policy (payment_policy) {

    let is_list_of_len_2 = payment_policy.every(function (t) {
        return t.length === 2
    });

    let is_first_int = payment_policy.every(function (t) {
        return typeof(t[0]) === 'number'
    });

    let is_second_int_or_string = payment_policy.every(function (t) {
        
        let boolean = typeof(t[1]) === 'number' || typeof(t[1]) === 'string'
        return boolean
    });

    let sum = 0
    payment_policy.forEach(t => {
        sum += t[0]
    });

    let sum_to_a_hundred = sum === 100;

    if (is_second_int_or_string && is_list_of_len_2) {
        for (let i = 0; i < payment_policy.length; i++) {
            let _ = extract_dynamic_date(payment_policy[i][1])
        }
    };

    if (!is_list_of_len_2) {
        return [is_list_of_len_2, 'is_list_of_len_2']
    };

    if (!is_first_int) {
        return [is_first_int, 'is_first_int']
    };

    if (!is_second_int_or_string) {
        return [is_second_int_or_string, 'is_second_int_or_string']
    };

    if (!sum_to_a_hundred) {
        return [sum_to_a_hundred, 'sum_to_a_hundred']
    };

    return [true, '']
};

function create_cash_flow (activity_slice, assigned_cost_items, payment_policy) {

    let cash_flow = [];
    let total_cost = assigned_cost_items['item_cost'];
    
    
    
    for(let i = 0; i< payment_policy.length; i++){
      let fraction = payment_policy[i][0];
      let dynamic_date = payment_policy[i][1];
      let payment_cost = fraction / 100*total_cost;
      let payment_date;
      
      if(typeof dynamic_date == 'number'){
        date_used = assigned_cost_items['date_used'];
        
        payment_date = new Date()
        payment_date.setDate(date_used.getDate() + dynamic_date);
        
      }
      if(typeof dynamic_date == 'string'){
        dynamic_date = extract_dynamic_date(dynamic_date);
        let op = dynamic_date[2];
        let days = dynamic_date[3];
        let period = dynamic_date[1];
        
        
        if(op == '+'){
          let date_used = activity_slice[period];
          payment_date = new Date();
          payment_date.setDate(date_used.getDate() + days);
        }
        if(op == '-'){
          let date_used = activity_slice[period];
          payment_date = new Date();
          payment_date.setDate(date_used.getDate() - days);

        }
      }
    
    cash_flow.push([payment_date, payment_cost]);
    }
  return cash_flow;

};