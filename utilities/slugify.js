const nanoIdForSlug = require('./nanoIdForSlug').nanoIdForSlug;

const sets = [
    {to: 'a', from: /[ÀÁÂÃÄÅĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]/gi},
    {to: 'ae', from: /[Æ]/gi},
    {to: 'c', from: /[ÇĆĈČ]/gi},
    {to: 'd', from: /[ÐĎĐÞ]/gi},
    {to: 'e', from: /[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]/gi},
    {to: 'g', from: /[ĜĞĢǴ]/gi},
    {to: 'h', from: /[ĤḦ]/gi},
    {to: 'i', from: /[ÌÍÎÏĨĪĮİỈỊ]/gi},
    {to: 'j', from: /[Ĵ]/gi},
    {to: 'ij', from: /[Ĳ]/gi},
    {to: 'k', from: /[Ķ]/gi},
    {to: 'l', from: /[ĹĻĽŁ]/gi},
    {to: 'm', from: /[Ḿ]/gi},
    {to: 'n', from: /[ÑŃŅŇ]/gi},
    {to: 'o', from: /[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]/gi},
    {to: 'oe', from: /[Œ]/gi},
    {to: 'p', from: /[ṕ]/gi},
    {to: 'r', from: /[ŔŖŘ]/gi},
    {to: 's', from: /[ßŚŜŞŠ]/gi},
    {to: 't', from: /[ŢŤ]/gi},
    {to: 'u', from: /[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]/gi},
    {to: 'w', from: /[ẂŴẀẄ]/gi},
    {to: 'x', from: /[ẍ]/gi},
    {to: 'y', from: /[ÝŶŸỲỴỶỸ]/gi},
    {to: 'z', from: /[ŹŻŽ]/gi},
    {to: '-', from: /[·/_,:;\']/gi}
];

module.exports.slugify = function(inputText){
    const separator = '_';
    var text = inputText.toLowerCase().trim();

    text = text.toString()
        .replace(/&amp\;/g,'-and-')      // Replace HTML entity 'and' -
        .replace(/&.+;/g,'-');         // Replace HTML entities  with -
    
    sets.forEach(set => {
        text = text.replace(set.from, set.to);
    });

    text = text.toString().toLowerCase()
        .replace(/\s+/g, '-')         // Replace spaces with -
        .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
        .replace(/\--+/g, '-')        // Replace multiple - with single -
        .replace(/^-+/, '')           // Trim - from start of text
        .replace(/-+$/, '');          // Trim - from end of text

    if ((typeof separator !== 'undefined') && (separator !== '-')) {
        text = text.replace(/-/g, separator);
    }

    if(text.length <= 3){
        text = `${text}${nanoIdForSlug()}`;  
    }

    return text;
}
  