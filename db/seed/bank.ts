import { db } from "../../lib/db"
import {bank} from "../business-schema"
import { v7 as uuidv7 } from "uuid"


const banks = [
  {
    code: "BBL",
    nameTh: "ธนาคารกรุงเทพ",
    nameEn: "Bangkok Bank",
  },
  {
    code: "KBANK",
    nameTh: "ธนาคารกสิกรไทย",
    nameEn: "Kasikornbank",
  },
  {
    code: "KTB",
    nameTh: "ธนาคารกรุงไทย",
    nameEn: "Krung Thai Bank",
  },
  {
    code: "SCB",
    nameTh: "ธนาคารไทยพาณิชย์",
    nameEn: "Siam Commercial Bank",
  },
  {
    code: "BAY",
    nameTh: "ธนาคารกรุงศรีอยุธยา",
    nameEn: "Bank of Ayudhya",
  },
  {
    code: "TTB",
    nameTh: "ธนาคารทหารไทยธนชาต",
    nameEn: "TMBThanachart Bank",
  },
  {
    code: "GSB",
    nameTh: "ธนาคารออมสิน",
    nameEn: "Government Savings Bank",
  },
  {
    code: "GHB",
    nameTh: "ธนาคารอาคารสงเคราะห์",
    nameEn: "Government Housing Bank",
  },
  {
    code: "BAAC",
    nameTh: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร",
    nameEn: "Bank for Agriculture and Agricultural Cooperatives",
  },
  {
    code: "CIMB",
    nameTh: "ธนาคารซีไอเอ็มบี ไทย",
    nameEn: "CIMB Thai Bank",
  },
  {
    code: "UOB",
    nameTh: "ธนาคารยูโอบี",
    nameEn: "United Overseas Bank",
  },
  {
    code: "KKP",
    nameTh: "ธนาคารเกียรตินาคินภัทร",
    nameEn: "Kiatnakin Phatra Bank",
  },
  {
    code: "LH",
    nameTh: "ธนาคารแลนด์ แอนด์ เฮ้าส์",
    nameEn: "Land and Houses Bank",
  },
  {
    code: "ICBC",
    nameTh: "ธนาคารไอซีบีซี (ไทย)",
    nameEn: "Industrial and Commercial Bank of China (Thai)",
  },
  {
    code: "OTHER",
    nameTh: "ธนาคารอื่น ๆ",
    nameEn: "Other Bank",
  },
];


const main = async() => {
    for(const item of banks){
        await db.insert(bank).values({
            id: uuidv7(),
            code: item.code,
            nameTh: item.nameTh,
            nameEn:item.nameEn
        }).onConflictDoNothing({ // onConflictDoNothing คือ cancle insert ถ้ามี conflict
            target: bank.code
        })
    }
    console.log(`Seeded ${banks.length} banks`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1)
    
})