var authorizedChatIds = ["authorised_chat_id_1"];
var token = "bot_token";

function setTelegramWebhook() {
  var url = "url_of_the_google_script_web_app";
  var apiUrl =
    "https://api.telegram.org/bot" +
    token +
    "/setWebhook?url=" +
    encodeURIComponent(url);

  var response = UrlFetchApp.fetch(apiUrl);
  Logger.log(response.getContentText());
}

function sendDailyNotifications() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  var data = sheet.getDataRange().getValues();
  var today = new Date();
  var sentToday = false;
  var message = "Customers with upcoming expirations:\n";

  for (var i = 1; i < data.length; i++) {
    var customerName = data[i][2];
    var duration = parseInt(data[i][9], 10);

    if (!isNaN(duration) && duration <= 7) {
      message += "- " + customerName + "\n";
      sentToday = true;
    }
  }

  if (!sentToday) {
    message = "N/A";
  }

  authorizedChatIds.forEach((chatId) => sendTelegramMessage(message, chatId));
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  var data = sheet.getDataRange().getValues();
  var updates = JSON.parse(e.postData.contents);
  var command = updates.message.text.toLowerCase();
  var chatId = updates.message.chat.id.toString();

  if (!authorizedChatIds.includes(chatId)) {
    sendTelegramMessage("Unauthorized access.", chatId);
    return;
  }

  //   var response = "";
  //   if (command === "/all") {
  //     response = "🏷" + getCustomerList(data);
  //   } else if (command === "/active") {
  //     response = "✅ " + getFilteredCustomerList(data, "Active\n");
  //   } else if (command === "/terminate") {
  //     response = "❌ " + getFilteredCustomerList(data, "Terminated\n");
  //   } else if (command === "/expsoon") {
  //     response = "⚠️ " + getFilteredCustomerList(data, "Expire Soon\n");
  //   } else {
  //     response = getCustomerDetails(data, command);
  //   }

  //   sendTelegramMessage(response, chatId);
  // }

  var response = "";
  // Handle different commands
  if (command === "/all") {
    response = getCustomerList(data);
  } else if (command === "/active") {
    response = "✅ " + getFilteredCustomerList(data, "Active");
  } else if (command === "/terminate") {
    response = "❌ " + getFilteredCustomerList(data, "Terminated");
  } else if (command === "/expsoon") {
    response = "⚠️ " + getFilteredCustomerList(data, "Expire Soon");
  } else if (command.startsWith("/cus ")) {
    response = getCustomerDetails(data, command.replace("/cus ", "").trim());
  } else {
    response = "Invalid command.";
  }

  sendTelegramMessage(response, chatId);
}

function getCustomerList(data) {
  var message = "List of customers:\n";
  for (var i = 1; i < data.length; i++) {
    message += i + ". " + data[i][2] + "\n";
  }
  return message;
}

function getFilteredCustomerList(data, status) {
  var message = "List of customers with status " + status + ":\n";
  var index = 1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][10] === status) {
      message += index + ". " + data[i][2] + "\n";
      index++;
    }
  }
  return message || "No customers found";
}
// // Function to get detailed customer information
// function getCustomerDetails(data, searchQuery) {
//   for (var i = 1; i < data.length; i++) {
//     if (data[i][2].toLowerCase().includes(searchQuery.toLowerCase())) {
//       return `ℹ️ Information of ${data[i][2]}:\n` +
//         `- Customer ID : ${data[i][0]}\n` +
//         `- Account ID : ${data[i][1]}\n` +
//         `- Service : ${data[i][3]}\n` +
//         `- Bandwidth : ${data[i][4]}\n` +
//         `- Service Type : ${data[i][5]}\n` +
//         `- Contract : ${data[i][6]}\n` +
//         `- Issue Date : ${formatDate(data[i][7])}\n` +
//         `- Next Bill : ${data[i][8] === "N/A" ? "N/A" : formatDate(data[i][8])}\n` +
//         `- Duration : ${data[i][9] === "N/A" ? "N/A" : data[i][9]}\n` +
//         `- Terminated Date : ${data[i][11] === "N/A" ? "N/A" : formatDate(data[i][11])}\n` +
//         `- Status : ${data[i][10]}`;
//     }
//   }
//   return "Customer not found.";
// }

// Function to get detailed customer information
function getCustomerDetails(data, searchQuery) {
  for (var i = 1; i < data.length; i++) {
    if (data[i][2].toLowerCase().includes(searchQuery.toLowerCase())) {
      var statusEmoji =
        data[i][10] === "Active"
          ? "✅"
          : data[i][10] === "Terminated"
          ? "❌"
          : "⚠️";
      return (
        `ℹ️ Information of ${data[i][2]}:\n` +
        `- Customer ID : ${data[i][0]}\n` +
        `- Account ID : ${data[i][1]}\n` +
        `- Service : ${data[i][3]}\n` +
        `- Bandwidth : ${data[i][4]}\n` +
        `- Service Type : ${data[i][5]}\n` +
        `- Contract : ${data[i][6]}\n` +
        `- Issue Date : ${formatDate(data[i][7])}\n` +
        `- Next Bill : ${
          data[i][8] === "N/A" ? "N/A" : formatDate(data[i][8])
        }\n` +
        `- Duration : ${data[i][9] === "N/A" ? "N/A" : data[i][9]}\n` +
        `- Terminated Date : ${
          data[i][11] === "N/A" ? "N/A" : formatDate(data[i][11])
        }\n` +
        `- Status : ${data[i][10]} ${statusEmoji}`
      );
    }
  }
  return "Customer not found.";
}

// Function to format date as DD-MMM-YY
function formatDate(dateValue) {
  if (!dateValue || dateValue === "N/A") return "N/A";
  var date = new Date(dateValue);
  var options = { year: "numeric", month: "short", day: "2-digit" };
  return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
}
function sendTelegramMessage(message, chatId) {
  var url = "https://api.telegram.org/bot" + token + "/sendMessage";
  var payload = {
    chat_id: chatId,
    text: message,
  };
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(url, options);
}

function scheduleDailyNotification() {
  ScriptApp.newTrigger("sendDailyNotifications")
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .create();
}
