import datetime
from typing import List, Tuple
import re


class DynamicDateError(Exception):
    pass


def extract_dynamic_date(dynamic_date: str):

    expression = '\$(harvest_date|sow_date|campaign_start_date|campaign_end_date)(-|\+)(\d+)'
    result = re.search(expression, dynamic_date)

    if result == None:
        raise DynamicDateError

    else:
        col, op, days = result.groups()
        return (col, op, int(days))


def validate_payment_policy(payment_policy):
    """Validates if payment policies provided are structured in the desired way."""

    is_list_of_len_2 = all([len(t) == 2 for t in payment_policy])
    is_first_int = all([type(t[0]) == int for t in payment_policy])
    is_second_int_or_string = all([((type(t[1]) == str) or (
        type(t[1] == int))) for t in payment_policy])
    amount_to_a_hundred = sum([t[0] for t in payment_policy]) == 100

    if is_second_int_or_string and is_list_of_len_2:
        for _, dynamic_date in payment_policy:
            if type(dynamic_date) == str:
                _ = extract_dynamic_date(dynamic_date=dynamic_date)

    if not is_list_of_len_2:
        return (is_list_of_len_2, 'is_list_of_len_2')
    if not is_first_int:
        return (is_first_int, 'is_first_int')
    if not is_second_int_or_string:
        return (is_second_int_or_string, 'is_second_int_or_string')
    if not amount_to_a_hundred:
        return (amount_to_a_hundred, 'amount_to_a_hundred')

    return (True, '')


def create_cash_flow(activity_slice, assigned_cost_item, payment_policy):

    cash_flow = []
    total_cost = assigned_cost_item['item_cost']

    for fraction, dynamic_date in payment_policy:

        payment_cost = fraction / 100 * total_cost

        if type(dynamic_date) == int:
            payment_date = assigned_cost_item['date_used'] + \
                datetime.timedelta(days=dynamic_date)

        elif type(dynamic_date) == str:
            col, op, days = extract_dynamic_date(dynamic_date=dynamic_date)

            if op == '+':
                payment_date = activity_slice[col] + \
                    datetime.timedelta(days=days)
            elif op == '-':
                payment_date = activity_slice[col] - \
                    datetime.timedelta(days=days)

        cash_flow.append([payment_date, payment_cost])

    return cash_flow
