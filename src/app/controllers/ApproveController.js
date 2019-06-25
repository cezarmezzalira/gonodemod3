const Purchase = require('../models/Purchase')
const Ad = require('../models/Ad')

class ApproveController {
  async update (req, res) {
    // recupera ID da compra
    const { id } = req.params

    // recupera o Anuncio (Ad)
    const { ad } = await Purchase.findById(id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    // se acaso o usuário não for o criador do anúncio
    // retorna erro não permitindo a alteração
    if (!ad.author._id.equals(req.userId)) {
      return res.status(401).json({ error: "You're not the ad author " })
    }

    // se o campo purchasedBy já estiver preenchido, significa que
    // o anúncio foi finalizado.
    if (ad.purchasedBy) {
      return res
        .status(400)
        .json({ error: 'This ad had already been purchased.' })
    }
    // coloca o ID da compra no anuncio
    //  ad.purchasedBy = id
    const updatedAd = await Ad.findByIdAndUpdate(
      ad.id,
      { purchasedBy: id },
      { new: true }
    )
    // salva o Anúncio
    // ad.save()

    // retorna o Anúncio salvo
    return res.json(updatedAd)
  }
}

module.exports = new ApproveController()
