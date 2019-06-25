const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    // recupera do body o Ad e o content
    const { ad, content } = req.body
    // retorna o anuncio com os dados do author
    const purchaseAd = await Ad.findById(ad).populate('author')

    // retorna o usuário que está fazendo a requisição
    const user = await User.findById(req.userId)

    const purchase = await Purchase.create({
      ad: purchaseAd.id,
      user: req.userId,
      content
    })

    // Adiciona na fila para enviar email ao vendendor, após a inserção da intenção
    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.json(purchase)

    // return res.send()
  }

  async accept (req, res) {
    // recupera a Purchase para pegar o ID do Ad
    const purchase = Purchase.findById(req.params.id)
    console.log(purchase.ad.id)
    // const ad = await Ad.findByIdAndUpdate(
    //   purchase.ad,
    //   { purchasedBy: purchase },
    //   {
    //     new: true
    //   }
    // )
    // return res.json(ad)
    return res.save()
  }
}

module.exports = new PurchaseController()
