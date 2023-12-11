interface Options {
    maxSize: number
}

/**
 * 压缩图片
 * @param file 文件
 * @param options
 */
export function compressImage(file: File, options: Options = {maxSize: 1024}): Promise<string> {
    return new Promise((res, rej) => {
        const targetSizeKB = options.maxSize;

        if (!file || !targetSizeKB) {
            alert("请选择图片文件并设置目标文件大小");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result as string
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                const maxWidth = 800;
                const maxHeight = 600;

                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const aspectRatio = width / height;
                    if (aspectRatio > 1) {
                        width = maxWidth;
                        height = width / aspectRatio;
                    } else {
                        height = maxHeight;
                        width = height * aspectRatio;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                let quality = 1.0;

                const targetSizeBytes = targetSizeKB * 1024;

                do {
                    const dataUrl = canvas.toDataURL("image/jpeg", quality);
                    const compressedFileSize = dataUrl.length;

                    if (compressedFileSize <= targetSizeBytes) {
                        res(dataUrl);
                    }

                    quality -= 0.1;
                } while (quality > 0);
            };
        };
        reader.readAsDataURL(file);
    });
}

/**
 * // 使用例子
 *   const formData = new FormData();
 *     const blob = base64ToBlob(base64String, mimeType);
 *
 *     // 添加Blob对象到FormData
 *     formData.append('file', blob, 'filename.jpg');
 *
 *     // 现在formData可以用于发送到服务器
 *     return formData;
 * @param dataURI
 * @param mimeType
 */
export function base64ToBlob(dataURI: string, mimeType: { type: string }): Blob {
    const byteString = atob(decodeURIComponent(dataURI.split(',')[1]));


    // 创建一个Uint8Array
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    // 将base64数据复制到Uint8Array
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], mimeType);
}



// const file = form.file
//   const base64String = await compressImage(file)
//   let formData = new FormData();
//   const blob = base64ToBlob(base64String, {type: file.type});
//   formData.append("multipartFile", blob, file.name)
//   let response = await request.post("/rfxxcj/ocrIdCard", formData, {
//     headers: {
//       "content-type": "multipart/form-data",
//       responseType: "blob",
//     },
//   })