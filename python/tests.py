from cash_flow import DynamicDateError, create_cash_flow
import datetime


activity_slice = {
    'sow_date': datetime.datetime(2022, 4, 1),
    'harvest_date': datetime.datetime(2022, 9, 1),
    'campaign_end_date': datetime.datetime(2022, 6, 1),
    'campaign_start_date': datetime.datetime(2022, 1, 1)
}

policy_1 = [[50, 0], [50, 30]]
policy_2 = [[100, "$harvest_date+30"]]
policy_3 = [[45, 0], [55, 60]]
policy_4 = [[30, "$harvest_date+30"],
            [30, "$harvest_date+60"], [40, "$harvest_date+90"]]
policy_5 = [[100, "$campaign_end_date+90"]]
policy_6 = [[75, "$sow_date-15"], [25, "$sow_date+15"]]
bad_policy_1 = [[120, 0]]
# bad_policy_2 = [[10, True], [50, 0], [40, 80]]


assigned_cost_item = {
    'item_cost': 20000,
    'date_used': datetime.datetime(2021, 12, 1),
    'category': 'semilla'
}


def test_create_cash_flow_policy_1():
    result = [[datetime.datetime(2021, 12, 1), 10000.0], [
        datetime.datetime(2021, 12, 31), 10000.0]]
    policy = [[50, 0], [50, 30]]

    assert result == create_cash_flow(
        activity_slice, assigned_cost_item, policy)


def test_create_cash_flow_policy_2():
    result = [[datetime.datetime(2022, 10, 1), 20000.0]]
    policy = [[100, "$harvest_date+30"]]

    assert result == create_cash_flow(
        activity_slice, assigned_cost_item, policy)


def test_create_cash_flow_policy_3():
    result = [[datetime.datetime(2021, 12, 1), 9000.0], [
        datetime.datetime(2022, 1, 30), 11000.0]]
    policy = [[45, 0], [55, 60]]

    assert result == create_cash_flow(
        activity_slice, assigned_cost_item, policy)


def test_create_cash_flow_policy_4():
    result = [[datetime.datetime(2022, 10, 1), 6000.0], [datetime.datetime(
        2022, 10, 31), 6000.0], [datetime.datetime(2022, 11, 30), 8000.0]]
    policy = [[30, "$harvest_date+30"],
              [30, "$harvest_date+60"], [40, "$harvest_date+90"]]

    assert result == create_cash_flow(
        activity_slice, assigned_cost_item, policy)


def test_create_cash_flow_policy_5():
    result = [[datetime.datetime(2022, 8, 30, 0, 0), 20000.0]]
    policy = [[100, "$campaign_end_date+90"]]

    assert result == create_cash_flow(
        activity_slice, assigned_cost_item, policy)


def test_create_cash_flow_policy_6():
    result = [[datetime.datetime(2022, 3, 17, 0, 0), 15000.0], [
        datetime.datetime(2022, 4, 16), 5000.0]]
    policy = [[75, "$sow_date-15"], [25, "$sow_date+15"]]

    assert result == create_cash_flow(
        activity_slice, assigned_cost_item, policy)


def test_create_cash_flow_bad_policy_1():
    try:
        _ = create_cash_flow(activity_slice, assigned_cost_item, bad_policy_1)
    except DynamicDateError:
        True


# def test_create_cash_flow_bad_policy_2():
#     with pytest.raises(DynamicDateError):
#         _ = create_cash_flow(activity_slice, assigned_cost_item, bad_policy_2)
