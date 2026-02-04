import ImageKit from '@imagekit/nodejs';

// private_n950oHK/RmOC0NHjPyYvBpnGXO8=

const imagekit = new ImageKit({
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY
})

async function uploadFile(buffer){
    const result = await imagekit.files.upload({
        file : buffer.toString("base64"),
        fileName : "image.jpg"
    })

    return result
}

export default uploadFile