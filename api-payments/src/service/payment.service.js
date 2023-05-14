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

export async function checkCreditCard(number, expiration, cvv) {
  const amex = new RegExp('^3[47][0-9]{13}$');
  const visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
  const cup1 = new RegExp('^62[0-9]{14}[0-9]*$');
  const cup2 = new RegExp('^81[0-9]{14}[0-9]*$');

  const mastercard = new RegExp('^5[1-5][0-9]{14}$');
  const mastercard2 = new RegExp('^2[2-7][0-9]{14}$');

  const disco1 = new RegExp('^6011[0-9]{12}[0-9]*$');
  const disco2 = new RegExp('^62[24568][0-9]{13}[0-9]*$');
  const disco3 = new RegExp('^6[45][0-9]{14}[0-9]*$');

  const diners = new RegExp('^3[0689][0-9]{12}[0-9]*$');
  const jcb = new RegExp('^35[0-9]{14}[0-9]*$');

  if (
    !visa.test(number)
    && !amex.test(number)
    && !mastercard.test(number)
    && !mastercard2.test(number)
    && !cup1.test(number)
    && !cup2.test(number)
    && !disco1.test(number)
    && !disco2.test(number)
    && !disco3.test(number)
    && !diners.test(number)
    && !jcb.test(number)

  ) {
    throw new Error('Invalid credit card number!');
  }

  if (cvv.length < 3 || cvv.length > 4) {
    throw new Error('Invalid CVV!');
  }

  if (expiration.length !== 4 && expiration.length !== 5) {
    throw new Error('Invalid expiration date!');
  }

  return true;
}
