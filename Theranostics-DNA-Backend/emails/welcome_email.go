package emails

import (
	"fmt"
	"theransticslabs/m/utils"
)

// WelcomeEmail constructs the HTML body for the welcome email.
func WelcomeEmail(firstName, lastName, email, password, appUrl string) string {
	bodyContent := fmt.Sprintf(`
	<tr>
        <td style="padding: 30px">
          <h2
            style="
              margin-top: 0;
              margin-bottom: 16px;
              color: #000;
              font-size: 26px;
              line-height: 32px;
              font-weight: 700;
              margin-bottom: 8px;
            "
          >
           Welcome to Theranostics – Let’s Get Started!
          </h2>
          <p
            style="
              line-height: 20px;
              font-size: 14px;
              font-weight: 400;
              color: #545454;
              margin-bottom: 8px;
              margin-top: 0px;
            "
          >
            Dear %s,
          </p>
          <p
            style="
              line-height: 20px;
              font-size: 14px;
              font-weight: 400;
              color: #545454;
              margin-bottom: 8px;
              margin-top: 0px;
            "
          >
           Welcome to <strong>Theranostics</strong>! We’re excited to have you on board and can’t wait for you to experience the benefits of our platform.
          </p>
		   <p
            style="
              line-height: 20px;
              font-size: 14px;
              font-weight: 400;
              color: #545454;
              margin-bottom: 8px;
              margin-top: 0px;
            "
          >
         Here are your login details to get started:
          </p>
          <table>
            <tr>
              <td>
                <table style="width: 100%%" border="0" cellpadding="0" cellspacing="0" >
                  <tr>
                    <td>
                      <p
                        style="
                          margin-bottom: 8px;
                          margin-top: 0px;
                          color: #545454;
                          font-size: 14px;
                        "
                      >
                        <strong
                          style="color: #000; font-size: 14px; font-weight: 600"
                          >Email:</strong
                        >
                        %s
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style="
                          margin-bottom: 8px;
                          margin-top: 0px;
                          color: #545454;
                          font-size: 14px;
                        "
                      >
                        <strong
                          style="color: #000; font-size: 14px; font-weight: 600"
                          >Temporary Password:</strong
                        >
                       %s
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style="
                          line-height: 20px;
                          font-size: 14px;
                          font-weight: 400;
                          color: #545454;
                          margin-bottom: 8px;
                          margin-top: 0px;
                        "
                      >
                        	For security reasons, please log in and update your password at your earliest convenience.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <table style="width: 100%%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <a
                  href="%s/login"
                  style="
                    margin:0 0 30px 0;
                    font-weight: 700;
                    font-size: 14px;
                    color: #fff;
                    background: #75ac71;
                    height: 38px;
                    width: 190px;
                    display: inline-block;
                    text-align: center;
                    line-height: 38px;
                    border-radius: 4px;
                    text-decoration: none;
                  "
                  >Login To Your Account</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <table style="width: 100%%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 0 30px">
               
	`, utils.CapitalizeWords(fmt.Sprintf("%s %s", firstName, lastName)), email, password, appUrl)

	return CommonEmailTemplate(bodyContent)
}
