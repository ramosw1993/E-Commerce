const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  try {
    // find all tags
    const tagData = await Tag.findAll({
      // be sure to include its associated Product data
      include: [
        {
          model: Product,
          through: {
            model: ProductTag,
            attributes: ["id", "tag_id", "product_id"],
          },
        },
      ],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          through: {
            model: ProductTag,
            attributes: ["id", "tag_id", "product_id"],
          },
        },
      ],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ message: `internal server error: ${err}` });
  }
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    if (!req.body || !req.body.tag_name) {
      res.status(404).json(`Invalid entry of data`);
      return;
    }
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ message: `internal server error: ${err}` });
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    await ProductTag.destroy({ where: { tag_id: req.params.id } });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
