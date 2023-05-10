import twilio from "twilio";

export async function sendConfirmationSms(user, token) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_NUMBER;

  if (accountSid && authToken && twilioNumber) {
    const client = twilio(accountSid, authToken);

    await client.messages.create({
      body: 'Confirm your payment: ' + process.env.API_PAYMENTS_URL + '/confirm/' + token,
      from: twilioNumber,
      to: user.phone_number,
    });
  }
}