import { eyID } from './environment'

const balanceFields = [
  'id' ,
  'type' ,
  'purpose' ,
  'transactionId' ,
  'position' ,
  'assetId' ,
  'assetAlias' ,
  'asset' ,
  'assetDefinition' ,
  'assetTags' ,
  'assetIsLocal' ,
  'amount' ,
  'accountId' ,
  'accountAlias' ,
  'account' ,
  'accountTags' ,
  'controlProgram' ,
  'address' ,
  'programIndex' ,
  'spentOutputId' ,
  'refData' ,
  'sourceId' ,
  'sourcePos' ,
  'issuanceProgram' ,
  'isLocal' ,
  'referenceData' ,
  'change'
]

const txInputFields = [
  'type',
  'asset',
  'amount',
  'account',
  'controlProgram',
  'address',
]

const txOutputFields = [
  'type',
  'id',
  'asset',
  'amount',
  'account',
  'controlProgram',
  'address',
]

const unspentFields = [
  'type',
  'purpose',
  'transactionId',
  'position',
  'assetId',
  'assetAlias',
  'assetDefinition',
  'assetTags',
  'assetIsLocal',
  'amount',
  'accountId',
  'accountAlias',
  'accountTags',
  'controlProgram',
  'programIndex',
  'refData',
  'sourceId',
  'sourcePos',
  'isLocal',
  'referenceData',
  'change',
]

const buildDisplay = (item, fields, eyAmountUnit, t) => {
  const details = []
  const decimals = (item.assetDefinition && item.assetDefinition.decimals && item.assetId !== eyID)?
    item.assetDefinition.decimals: null
  fields.forEach(key => {
    if (item.hasOwnProperty(key)) {
      if(key === 'amount'){
        details.push({
          label: t(`form.${key}`),
          value: decimals? formatIntNumToPosDecimal(item[key], decimals) :normalizeGlobalEYAmount(item['assetId'], item[key], eyAmountUnit)
        })
      }else if(key === 'asset' && item.assetId !=='0000000000000000000000000000000000000000000000000000000000000000'){
        details.push({
          label:  t(`form.${key}`),
          value: item[key],
          link: `/assets/${item.assetId}`
        })
      }else if(key === 'account'){
        details.push({
          label:  t(`form.${key}`),
          value: item[key],
          link: `/accounts/${item.accountId}`
        })
      }else{
        details.push({label:  t(`form.${key}`), value: item[key]})
      }
    }
  })
  return details
}

const addZeroToDecimalPos = (src,pos) => {
  if(src != null && src !== '' ){
    let srcString = src.toString()
    let rs = srcString.indexOf('.')
    if (rs < 0) {
      rs = srcString.length
      srcString += '.'
    }
    while (srcString.length <= rs + pos) {
      srcString += '0'
    }
    return srcString
  }
  return src
}

const formatIntNumToPosDecimal = (neu,pos) => {
  if(neu != null && neu !== ''){
    let neuString = neu.toString()
    let neuLength = neuString.length
    if(neuLength <= pos){
      let zeros = ''
      while(zeros.length < pos - neuLength){
        zeros += '0'
      }
      return '0.'+ zeros + neuString
    }else {
      return numberWithCommas(neuString.slice(0, -pos) + '.' + neuString.slice(-pos))
    }
  }
  return numberWithCommas(neu)
}

const numberWithCommas = (x) => {
  var parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const normalizeGlobalEYAmount = (assetID, amount, eyAmountUnit) => {
  //normalize EY Amount
  if (assetID === eyID) {
    switch (eyAmountUnit){
      case 'EY':
        return formatIntNumToPosDecimal(amount, 8)+' EY'
      case 'mEY':
        return formatIntNumToPosDecimal(amount, 5)+' mEY'
      case 'NEU':
        return amount+' NEU'
    }
  }
  return amount
}

export const normalizeEY = (amount, eyAmountUnit) => {
  switch (eyAmountUnit){
    case 'EY':
      return formatIntNumToPosDecimal(amount, 8)+' EY'
    case 'mEY':
      return formatIntNumToPosDecimal(amount, 5)+' mEY'
    case 'NEU':
      return amount+' NEU'
  }
}

export function formatEYAmount(value, pos)  {
  if (!value) {
    return value
  }

  const onlyNums = value.toString().replace(/[^0-9.]/g, '')

  // Create an array with sections split by .
  const sections = onlyNums.split('.')

  // Remove any leading 0s apart from single 0
  if (sections[0] !== '0' && sections[0] !== '00') {
    sections[0] = sections[0].replace(/^0+/, '')
  } else {
    sections[0] = '0'
  }

  // If numbers exist after first .
  if (sections[1]) {
    return sections[0] + '.' + sections[1].slice(0, pos)
  } else if (onlyNums.indexOf('.') !== -1 && pos !== 0) {
    return sections[0] + '.'
  } else {
    return sections[0]
  }
}

export function parseEYAmount(value, pos){
  if (!value) {
    return value
  }

  const onlyNums = value.replace(/[^0-9.]/g, '')
  const sections = onlyNums.split('.')

  let numDecimal = ''

  if (sections[1]) {
    numDecimal = sections[1].slice(0, pos)
  }
  while (numDecimal.length < pos) {
    numDecimal += '0'
  }

  //remove all the leading 0s
  let amountNum = sections[0] + numDecimal
  if(/^0*$/.test(amountNum)){
    amountNum = '0'
  }else {
    amountNum = amountNum.replace(/^0+/, '')
  }

  return amountNum
}

export function normalizeEYAmountUnit(assetID, amount, eyAmountUnit) {
  return normalizeGlobalEYAmount(assetID, amount, eyAmountUnit)
}

export function addZeroToDecimalPosition(value, deciPoint){
  return addZeroToDecimalPos(value, deciPoint)
}

export function converIntToDec(int, deciPoint){
  return formatIntNumToPosDecimal(int, deciPoint)
}

export function buildTxInputDisplay(input, eyAmountUnit, t) {
  return buildDisplay(input, txInputFields, eyAmountUnit, t)
}

export function buildTxOutputDisplay(output, eyAmountUnit, t) {
  return buildDisplay(output, txOutputFields, eyAmountUnit, t)
}

export function buildUnspentDisplay(output, eyAmountUnit, t) {
  const normalized = {
    amount: output.amount,
    accountId: output.accountId,
    accountAlias: output.accountAlias,
    assetId: output.assetId,
    assetAlias: output.assetAlias,
    controlProgram: output.program,
    programIndex: output.controlProgramIndex,
    sourceId: output.sourceId,
    sourcePos: output.sourcePos,
    change: output.change + ''
  }
  return buildDisplay(normalized, unspentFields, eyAmountUnit, t)
}

export function buildBalanceDisplay(balance, eyAmountUnit, t) {
  let amount = (balance.assetDefinition && balance.assetDefinition.decimals && balance.assetId !== eyID)?
    formatIntNumToPosDecimal(balance.amount, balance.assetDefinition.decimals): balance.amount
  return buildDisplay({
    amount: amount,
    assetId: balance.assetId,
    assetAlias: balance.assetAlias,
    accountAlias: balance.accountAlias
  }, balanceFields, eyAmountUnit, t)
}
