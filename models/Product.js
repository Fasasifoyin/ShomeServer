import mongoose from "mongoose";
import mongooseSlugPlugin from "mongoose-slug-plugin";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    oldPrice: {
      type: Number,
      required: true,
    },
    newPrice: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      required: true,
    },
    trending: {
      type: Boolean,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    like: {
      type: [String],
      default: [],
    },
    comments: {
      type: [
        {
          name: String,
          title: String,
          body: String,
          rating: Number,
          createdAt: {
            type: Date,
            default: new Date(),
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

productSchema.plugin(mongooseSlugPlugin, { tmpl: "<%= title %>" });
export default mongoose.model("Product", productSchema);
