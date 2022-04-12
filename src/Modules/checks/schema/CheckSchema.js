const { Schema } = require('mongoose');
const urlObject = require('url').URL;


const checkSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    href: {
        type: String,
        required: true
    },
    url: {
        type: String,
        // required: true,
    },
    protocol: {
        type: String,
        enum: ["http:", "https:", "tcp:"],
        // required: true,
    },
    path: {
        type: String,
        default: "/",
    },
    port: {
        type: Number,
    },
    webhook: String,
    timeout: {
        type: Number,
        default: 5,
    },
    interval: {
        type: Number,
        default: 10 * 60,
    },
    threshold: {
        type: Number,
        default: 1,
    },
    authentication: {
        username: {
            type: String
        },
        password: {
            type: String
        }
    },
    httpHeaders: [
        {
            key: String,
            value: String
        }
    ],
    assert: {
        statusCode: {
            type: Number
        }
    },

    tags: {
        type: [String],
    },
    ignoreSSL: {
        type: Boolean,
        required: true,
    },
    // isCheckActive: {
    //     type: Boolean,
    //     default: true
    // }
}, {
    timestamps: true
});

checkSchema.pre('save', function () {
    const Href = new urlObject(this.href);
    this.url = Href.host;
    this.protocol = Href.protocol;
    this.path = Href.pathname;
    this.port = Href.port;
    // this.authentication.username = Href.username;
    // this.authentication.password = Href.password;

});




module.exports = checkSchema;