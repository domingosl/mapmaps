const moment = require('moment');

new utilities.express
    .Service('payWithCard')
    .isPost()
    .respondsAt('/pay/card')
    .controller(async (req, res) => {

        try {

            let debitedUser;

            const presentDebitedUser = await gwApi.UsersByEmail.read([], { email: req.body.email });

            if(!presentDebitedUser) {
                debitedUser = (await gwApi.Users.create({
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    birthDate: moment().subtract(21, 'years').format('YYYY/MM/DD'),
                })).data;
            } else
                debitedUser = presentDebitedUser.data;


            const response = await gwApi.Payins.CC.create({
                creditedWallet: process.env.ORGANIZATION_WALLET,
                creditedUser: process.env.ORGANIZATION_OWNER,
                amount: req.body.amount,
                debitedUser: debitedUser._id,
                returnURL: req.body.returnURL
            });


            res.resolve(response.data);

        } catch (e) {
            res.forbidden("Something went wrong, please verify the information and try again");
        }
    });