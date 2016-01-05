import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

export const USER_NONACTIVE = 'USER_NONACTIVE';
export const USER_ACTIVE = 'USER_ACTIVE';

var userSchema = mongoose.Schema({
    displayName: String,
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    }
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.pass);
};

export default mongoose.model('User', userSchema);