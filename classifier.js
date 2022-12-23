const { BrainNLU } = require('node-nlp');
const { msg } = require(`./index`);

async function main() {
    const classifier = new BrainNLU({ language: 'th' });
    classifier.add('สวัสดี', 'สวัสดี');
    classifier.add('สวัสดีจ้า', 'สวัสดี');
    classifier.add('ดีจ้า', 'สวัสดี');
    classifier.add("อ้น", 'เรียกอ้น');
    classifier.add('พี่อ้น', 'เรียกอ้น');
    classifier.add('ไอ้อ้น', 'เรียกอ้น');
    await classifier.train();
}
main();
async function classifier(msg) {
    const classifications = await classifier.getBestClassification(msg);
    return classifications.intent;
}
module.exports = { classifier }