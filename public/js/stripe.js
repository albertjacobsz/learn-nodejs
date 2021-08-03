const stripe = Stripe('pk_test_51JKDHyI13r3tmq00J9rk8gTCOkiOlOJxvkghBYlRAkrTmZNfPJPjWsDZj3V4ppTo9gtL3kVOgv45RP9QEflTBgw700zWXl7hBl')
import axios from 'axios'
export const bookTour = async tourId => {
    try {
        const session = await axios({
            url: `/api/v1/bookings/checkout-session/${tourId}`
        });
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (err) {
        console.log(err)
    }


}