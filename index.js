const fs = require('fs');
const fetch = require('node-fetch');

let promises = [];
let result = [];

for(let i = 0; i<=480; i+=24) {
  promises.push(fetch(`https://api.nike.com/cic/browse/v1?queryid=products&anonymousId=B8B14AC900F9DC69792CC14B7F283F4A&endpoint=%2Fproduct_feed%2Frollup_threads%2Fv2%3Ffilter%3Dmarketplace(RU)%26filter%3Dlanguage(ru)%26filter%3DemployeePrice(true)%26filter%3DattributeIds(0f64ecc7-d624-4e91-b171-b83a03dd8550%2C16633190-45e5-4830-a068-232ac7aea82c)%26anchor%3D${i}%26consumerChannelId%3Dd9a5bc42-4b9c-4976-858a-f159cf99c647%26count%3D24`).then(arr=>{
    return arr.json();
  }))
}

Promise.all(promises).then(arr=>{
  arr.forEach((el, parentIndex)=> {
    const products = el.data.products.objects.map((item, idx)=>( {
      count: idx + (parentIndex * 24),
      title: item.publishedContent.properties.title,
      subtitle: item.publishedContent.properties.subtitle,
      productId: item.publishedContent.properties.products.productId,
      productPrice: item.productInfo[0].merchPrice.currentPrice,
      discounted: item.productInfo[0].merchPrice.discounted,
      fullPrice: item.productInfo[0].merchPrice.fullPrice
    }  ));
    result.push(products);
  })
  fs.writeFile("nike-products.json", JSON.stringify(result.flat(2)), function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
})


