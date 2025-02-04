package emails

import (
	"fmt"
	"theransticslabs/m/utils"
)

// CustomerKitRegistrationNotificationEmail generates an email template for customer notification
func CustomerKitRegistrationNotificationEmail(
	customerFirstName string,
	customerLastName string,
	customerEmail string,
	customerPhone string,
	customerStreetAddress string,
	customerTownCity string,
	customerRegion string,
	customerPostcode string,
	customerCountry string,
	customerShippingStreetAddress string,
	customerShippingTownCity string,
	customerShippingRegion string,
	customerShippingPostcode string,
	customerShippingCountry string,
	orderNumber string,
	trackingID string,
	clinicID string,
	productName string,
	productDescription string,
	productQuantity int,
	productPrice float64,
	productGSTPrice float64,
	productDiscount float64,
	totalPrice float64,
	barcodeNumber string,
	patientFirstName string,
	patientLastName string,
	patientGender string,
	patientEmail string,
	patientAge int,
) string {
	// Calculate GST percentage
	gstPercentage := (productGSTPrice / productPrice) * 100

	// Calculate discount value
	discountValue := (productPrice * productDiscount) / 100

	// Calculate subTotal
	subTotal := productPrice * float64(productQuantity)

	// Calculate totalGst
	gstTotal := productGSTPrice * float64(productQuantity)

	// Calculate totalDiscount
	discountTotal := discountValue * float64(productQuantity)

	// Prepare clinic ID section
	clinicIDSection := ""
	if clinicID != "" {
		clinicIDSection = fmt.Sprintf(`
				<tr>
		  <td
			style="
			  padding-bottom: 10px;
			  font-size: 14px;
			  font-weight: 400;
			  color: #545454;
			  padding: 10px 0;
			  border-bottom: 1px solid #ebebeb;
			  white-space: nowrap;
			"
		  >
			Clinic ID:
		  </td>
		  <td
			align="right"
			style="
			  padding-bottom: 10px;
			  font-size: 14px;
			  font-weight: 400;
			  color: #000;
			  padding: 10px 0;
			  border-bottom: 1px solid #ebebeb;
			"
		  >
			%s
		  </td>
		</tr>`, clinicID)
	}

	// Prepare Tracking ID section
	trackingIDSection := ""
	if trackingID != "" {
		trackingIDSection = fmt.Sprintf(`
					<tr>
			  <td
				style="
				  padding-bottom: 10px;
				  font-size: 14px;
				  font-weight: 400;
				  color: #545454;
				  padding: 10px 0;
				  border-bottom: 1px solid #ebebeb;
				  white-space: nowrap;
				"
			  >
				Tracking ID:
			  </td>
			  <td
				align="right"
				style="
				  padding-bottom: 10px;
				  font-size: 14px;
				  font-weight: 400;
				  color: #000;
				  padding: 10px 0;
				  border-bottom: 1px solid #ebebeb;
				"
			  >
				%s
			  </td>
			</tr>`, trackingID)
	}

	bodyContent := fmt.Sprintf(`
	 <tr align="center">
        <td style="padding: 40px 20px 30px 20px">
         
         <p
            style="
              line-height: 20px;
              font-size: 14px;
              font-weight: 400;
              color: #545454;
              margin-bottom: 0px;
              margin-top: 0px;
              padding: 0 70px;
            "
          >
           We are pleased to inform you that your kit has been successfully registered for the patient. Below are the details for your reference:
          </p>
        </td>
      </tr>
      <tr>
        <td style="font-size: 18px; font-weight: 700; line-height: 20px">
          <table style="width: 100%%" cellspacing="0" cellpadding="0">
            <tr>
              <td
                style="
                  padding: 0 20px 0px 20px;
                  font-weight: 700;
                  font-size: 18px;
                  color: #000;
                "
              >
                Customer Infromation
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <table
            cellspacing="0"
            cellpadding="0"
            width="100%%"
            style="padding: 20px"
          >
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  border-bottom: 1px solid #ebebeb;
                  margin-bottom: 10px;
                  white-space: nowrap;
                "
              >
                Name
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  border-bottom: 1px solid #ebebeb;
                  margin-bottom: 10px;
                "
              >
                %s
              </td>
            </tr>
			 %s
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Email
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
                %s
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Phone Number:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
                %s
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Billing Address:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
                %s, %s, %s, %s, %s
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  white-space: nowrap;
                "
              >
                Shipping Address:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                "
              >
               %s, %s, %s, %s, %s
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="font-size: 18px; font-weight: 700; line-height: 20px">
          <table style="width: 100%%" cellspacing="0" cellpadding="0">
            <tr>
              <td
                style="
                  padding: 0 20px 0px 20px;
                  font-weight: 700;
                  font-size: 18px;
                  color: #000;
                "
              >
                Order Information
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <table
            cellspacing="0"
            cellpadding="0"
            width="100%%"
            style="padding: 20px"
          >
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Order Number:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
                %s
              </td>
            </tr>
			%s
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Product Name:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
                %s
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Product Description:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  padding-left: 80px;
                "
              >
                %s
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Quantity
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
                %d
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Unit Price:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
                $ %.2f
              </td>
            </tr>
			<tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Sub Total:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
                $ %.2f
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
               GST (%.2f%%):
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
               $ %.2f
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Discount (%.2f%%):
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
              $ %.2f
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  white-space: nowrap;
                "
              >
                Total Cost:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                "
              >
               $ %.2f
              </td>
            </tr>
          </table>
        </td>
      </tr>     


	   <tr>
        <td style="font-size: 18px; font-weight: 700; line-height: 20px">
          <table style="width: 100%%" cellspacing="0" cellpadding="0">
            <tr>
              <td
                style="
                  padding: 0 20px 0px 20px;
                  font-weight: 700;
                  font-size: 18px;
                  color: #000;
                "
              >
                Patient Information
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <table
            cellspacing="0"
            cellpadding="0"
            width="100%%"
            style="padding: 20px"
          >
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Name:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
                %s
              </td>
            </tr>
             <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Email:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
                %s
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
               Gender:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
                %s
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                Age:
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  padding-left: 80px;
                "
              >
                %d
              </td>
            </tr>
            <tr>
              <td
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #545454;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                  white-space: nowrap;
                "
              >
                QRCode/Barcode Number
              </td>
              <td
                align="right"
                style="
                  padding-bottom: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #000;
                  padding: 10px 0;
                  border-bottom: 1px solid #ebebeb;
                "
              >
                %s
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
                
	`,
		utils.CapitalizeWords(fmt.Sprintf("%s %s", customerFirstName, customerLastName)),
		clinicIDSection,
		customerEmail,
		customerPhone,
		customerStreetAddress,
		customerTownCity,
		customerRegion,
		customerPostcode,
		customerCountry,
		customerShippingStreetAddress,
		customerShippingTownCity,
		customerShippingRegion,
		customerShippingPostcode,
		customerShippingCountry,
		orderNumber,
		trackingIDSection,
		productName,
		productDescription,
		productQuantity,
		productPrice,
		subTotal,
		gstPercentage,
		gstTotal,
		productDiscount,
		discountTotal,
		totalPrice,
		utils.CapitalizeWords(fmt.Sprintf("%s %s", patientFirstName, patientLastName)),
		patientEmail,
		patientGender,
		patientAge,
		barcodeNumber)

	return CommonEmailTemplate(bodyContent)
}
