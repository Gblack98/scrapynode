import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
export default {
    token: (payload)=>{

        const key = jwt.sign(
            payload
            ,
            process.env.SECRET,
            {
                expiresIn: '1h'
            }
        )
        return key;
    },
    crypt: (password) => bcrypt.hash(password, 10).then(function(hash) {
        return hash
    }),
    verify:(key)=> jwt.verify(key, process.env.SECRET, (err, payload) => {
        err && console.log("Vous êtes déconnecté(e)s")
        return payload
    }),
    decrypt: (pw_saisie,pw_charge) => bcrypt.compareSync(pw_saisie, pw_charge)
}