import React from 'react'
import {
  BaseShow,
  PageTitle,
  PageContent,
  KeyValueTable,
  Section,
  RawJsonButton,
} from 'features/shared/components'
import { normalizeGlobalEYAmount } from 'utility/buildInOutDisplay'

import { Summary } from './'
import { buildTxInputDisplay, buildTxOutputDisplay } from 'utility/buildInOutDisplay'
import { eyID } from 'utility/environment'
import moment from 'moment/moment'
import BigNumber from 'bignumber.js'


class Show extends BaseShow {

  render() {
    const item = this.props.item
    const t = this.props.t
    const eyAmountUnit = this.props.eyAmountUnit

    let view
    if (item) {
      const confirmation = this.props.highestBlock - item.blockHeight + 1
      const eyInput = item.inputs.reduce((sum, input) => {
        if (input.type === 'spend' && input.assetId === eyID) {
          sum = BigNumber(input.amount).plus(sum)
        }
        return sum
      }, 0)

      item.confirmations = confirmation

      const eyOutput = item.outputs.reduce((sum, output) => {
        if ((output.type === 'control' || output.type === 'retire')&& output.assetId === eyID) {
          sum = BigNumber(output.amount).plus(sum)
        }
        return sum
      }, 0)

      const gasAmount = eyInput > 0 ? eyInput.minus(eyOutput) : 0

      const gas = normalizeGlobalEYAmount(eyID, gasAmount, eyAmountUnit)

      const unconfirmedItem = (item.blockHeight === 0 && item.blockId === '0000000000000000000000000000000000000000000000000000000000000000')

      const status = (!item.statusFail)? t('form.succeed'): t('form.failed')

      const getInout = (inout) =>{
        let resultoutput = {}

        resultoutput.id = inout.id

        if(inout.address){
          resultoutput.address = inout.address
        }else if(inout.controlProgram){
          resultoutput.controlProgram = inout.controlProgram
        }

        resultoutput.amount = inout.amount

        if(inout.accountAlias ||inout.accountId){
          resultoutput.account = inout.accountAlias ||inout.accountId
        }

        resultoutput.accountId = inout.accountId
        resultoutput.asset = inout.assetAlias || inout.assetId
        resultoutput.assetId =  inout.assetId
        resultoutput.assetDefinition =  inout.assetDefinition
        resultoutput.type = inout.type

        return resultoutput
      }

      let outputs = []
      item.outputs.forEach((output,index) =>{
        let resultoutput = getInout(output)
        outputs[index] = resultoutput
      })

      let inputs = []
      item.inputs.forEach((input,index) =>{
        let resultinput = getInout(input)
        inputs[index] = resultinput
      })


      const title = <span>
        {t('transaction.transaction')}
        &nbsp;<code>{item.id}</code>
      </span>

      view = <div>
        <PageTitle title={title} />

        <PageContent>
          <Section
            title={t('form.summary')}
            actions={[
              <RawJsonButton key='raw-json' item={item} />
            ]}>
            <Summary transaction={item}  eyAmountUnit={eyAmountUnit}/>
          </Section>

          <KeyValueTable
            title={t('form.detail')}
            items={[
              {label: 'ID', value: item.id},
              {label: t('form.timestamp'), value:  unconfirmedItem ? '-' : moment.unix(item.timestamp).format()},
              {label: t('form.blockId'), value: unconfirmedItem? '-' : item.blockId},
              {label: t('form.blockHeight'), value: unconfirmedItem?
                  t('transaction.unconfirmedItem'): item.blockHeight },
              {label: t('form.position'), value: unconfirmedItem? '-' :item.position},
              {label: 'Gas', value: gas},
              {label: t('form.txStatus'), value: status}
            ]}
          />

          {inputs.map((input, index) =>
            <KeyValueTable
              key={index}
              title={index == 0 ? t('form.input') : ''}
              items={buildTxInputDisplay(input, eyAmountUnit, t)}
            />
          )}

          {outputs.map((output, index) =>
            <KeyValueTable
              key={index}
              title={index == 0 ?t('form.output') : ''}
              items={buildTxOutputDisplay(output, eyAmountUnit, t)}
            />
          )}
        </PageContent>
      </div>
    }

    return this.renderIfFound(view)
  }
}

// Container

import { actions } from 'features/transactions'
import { connect } from 'react-redux'
import {withNamespaces} from 'react-i18next'

const mapStateToProps = (state, ownProps) => ({
  item: state.transaction.items[ownProps.params.id],
  eyAmountUnit: state.core.eyAmountUnit,
  highestBlock: state.core.coreData && state.core.coreData.highestBlock
})

const mapDispatchToProps = ( dispatch ) => ({
  fetchItem: (id) => dispatch(actions.fetchItems({id: `${id}`}))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces('translations')(Show))
