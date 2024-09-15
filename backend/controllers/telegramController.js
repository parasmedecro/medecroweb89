import axios from "axios";

const sendAppointMessage = async (req, res) => {
  console.log("hi");
  const { slotTime, slotDate, docname, username, chatid,msg } = req.body;
  const botToken = process.env.BOT_TOKEN;
  const chatId = chatid;
  const message = `
  *Hi ${username.replace(/[-_!*]/g, '\\$&')},*
  
  Your appointment has been successfully ${msg} with Dr\\. *${docname.replace(/[-_!*]/g, '\\$&')}*\\.
  
  📅 *Slot Date:* ${slotDate.replace(/[_]/g, '\\_')}
  🕒 *Slot Time:* ${slotTime}
  
  Please make sure to be available during the scheduled time\\.
  
  _If you have any questions, feel free to contact us\\!_
  `;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'MarkdownV2'
    }),
  });

  const data = await response.json();
  if (data.ok) {
    console.log("Message sent successfully!");
  } else {
    console.error("Error sending message:", data);
  }
};

const sendPresMessage = async (req, res) => {
  const {uname,uchat,text} = req.body;
  const botToken = process.env.BOT_TOKEN;
  const chatId = uchat;

  // const message = `
  // *Hi ${username.replace(/[-_!*]/g, '\\$&')},*
  
  // Your appointment has been successfully ${msg} with Dr\\. *${docname.replace(/[-_!*]/g, '\\$&')}*\\.
  
  // 📅 *Slot Date:* ${slotDate.replace(/[_]/g, '\\_')}
  // 🕒 *Slot Time:* ${slotTime}
  
  // Please make sure to be available during the scheduled time\\.
  
  // _If you have any questions, feel free to contact us\\!_
  // `;

  // const message = `
  // *Prescription for ${prescription.patientName} (Age: ${prescription.patientAge})*
  // *Doctor:* ${prescription.doctorName} (${prescription.doctorSpecialty})
  
  // *Details:*
  // ${prescription.prescriptionDetails
  //   .map(
  //     (detail, index) => `
  //   - *Medicine:* ${detail.medicine}
  //   - *Dose:* ${detail.dose}
  //   - *Days:* ${detail.days}
  //   - *Slot:* ${detail.slot?.morning ? "Morning " : ""}${detail.slot?.afternoon ? "Afternoon " : ""}${detail.slot?.night ? "Night" : ""}
  //   - *Before/After:* ${detail.beforeAfter?.before ? "Before " : ""}${detail.beforeAfter?.after ? "After" : ""}
  //   `
  //   )
  //   .join("")}
  
  // *Advice:* ${prescription.advice.length > 0
  //   ? prescription.advice.join(", ")
  //   : "No advice"
  // }
  
  // *Investigations:* ${prescription.investigations.length > 0
  //   ? prescription.investigations.join(", ")
  //   : "No investigations"
  // }`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'MarkdownV2'
    }),
  });

  const data = await response.json();
  if (data.ok) {
    console.log("Message sent successfully!");
  } else {
    console.error("Error sending message:", data);
  }
};

const sendFile = async (chatId, fileUrl) => {
  try {
    let botToken = process.env.BOT_TOKEN;
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendDocument`,
      {
        chat_id: chatId,
        document: fileUrl,
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export { sendAppointMessage,sendPresMessage , sendFile };
