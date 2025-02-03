import { BsBuilding, BsFileText, BsCashCoin } from 'react-icons/bs'
import { FaTools, FaMoneyBillWave } from 'react-icons/fa'
import { BiWater } from 'react-icons/bi'
import { AiOutlineInsurance, AiOutlineShop } from 'react-icons/ai'
import { MdOutlineRealEstateAgent } from 'react-icons/md'
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi'

export const EXPENSE_TYPES = [
  {
    value: 'LAND_PURCHASE',
    label: 'Land Purchase',
    icon: BsBuilding
  },
  {
    value: 'LEGAL_FEES',
    label: 'Legal Fees',
    icon: BsFileText
  },
  {
    value: 'PROPERTY_TAX',
    label: 'Property Tax',
    icon: FaMoneyBillWave
  },
  {
    value: 'DEVELOPMENT_COST',
    label: 'Development Cost',
    icon: FaTools
  },
  {
    value: 'MAINTENANCE',
    label: 'Maintenance',
    icon: FaTools
  },
  {
    value: 'UTILITIES',
    label: 'Utilities',
    icon: BiWater
  },
  {
    value: 'INSURANCE',
    label: 'Insurance',
    icon: AiOutlineInsurance
  },
  {
    value: 'MARKETING',
    label: 'Marketing',
    icon: AiOutlineShop
  },
  {
    value: 'COMMISSION',
    label: 'Commission',
    icon: MdOutlineRealEstateAgent
  },
  {
    value: 'OTHER',
    label: 'Other',
    icon: HiOutlineDotsCircleHorizontal
  }
]; 