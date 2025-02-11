Please generate Google App Script code for telegram-bot as below :

- Remark the file i give you is xlsx file but i want it work with google sheet
- Function auto daily send to telegram via elegram-bot :

* When cell Duration <= 7 (If already send data in today don't send in next day)
* Send out everyday at 9:00 AM if no data send "N/A"

- Function filter from telegram-bot when user call as below :

* /all response all row Customer Name with index
* /active response row Customer Name that cell Status = Active with index
* /terminate response row Customer Name that cell Status = Terminated with index
* /expsoon response row Customer Name that cell Status = Expire Soon with index
  . Example message format as below :

- For /active filter response
  List customer that activ : 1. Customer Name 1 2. Customer Name 2 3. Customer Name 3 4. Customer Name 4 5. Customer Name 5 6. Customer Name 6 7. Customer Name 7 8. Customer Name 8 9. Customer Name 9 10. Customer Name 10
- For /terminate filter response
  List customer that terminated : 1. Customer Name 1 2. Customer Name 2 3. Customer Name 3 4. Customer Name 4 5. Customer Name 5 6. Customer Name 6 7. Customer Name 7 8. Customer Name 8 9. Customer Name 9 10. Customer Name 10
  and for /expsoon make it respone same filter

* /Customer Name 1 or some string (Uppercase or Lowercase letter) that match with data in row Customer Name response all data in row
  . Example response for /Customer Name 1 or some string (Uppercase or Lowercase letter) filter (All data read from spreadsheet cell)
  Information of Customer Name 1 : - Customer ID : CUS-10001 - Account ID : ACC-10001 - Service : Internet Service 20Mbps - Service : DIA - Contract : Monthly - Issue Date : 10-May-19 - Next Bill : N/A - Duration : N/A - Terminated Date : 30-Jun-19 - Status : Terminated

Please add emoji as example below when response

✅ List of customers with status Active:

1. Customer Name 30
2. Customer Name 31
3. Customer Name 32
4. Customer Name 33

❌ List of customers with status Terminated:

1. Customer Name 1
2. Customer Name 2
3. Customer Name 3
4. Customer Name 4

⚠️ List of customers with status Expire Soon:

1. Customer Name 47
2. Customer Name 48
3. Customer Name 49
4. Customer Name 55
