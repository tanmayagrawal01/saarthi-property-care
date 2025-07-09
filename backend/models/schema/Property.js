const mongoose = require('mongoose');
const slugify = require('slugify');
const PropertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      set: v => v.toLowerCase()
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    city_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    property_type: {
      type: String,
      enum: ['hotel', 'guesthouse', 'airbnb', 'pg', 'villa', 'homestay','apartment'],
      required: true
    },
    photos: {
      type: [String], // array of image URLs
      default: []
    },
    description: {
      type: String,
      maxlength: 1000
    },
    slug: {
      type: String
    }
    ,
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

PropertySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    const nameSlug = slugify(this.name, { lower: true });
    const uniqueSuffix = Date.now().toString().slice(-4);
    this.slug = `${nameSlug}-${uniqueSuffix}`;
  }
  next();
});

PropertySchema.index({ slug: 1 }, { unique: true, sparse: true });
PropertySchema.index({ user_id: 1 });
PropertySchema.index({ city_id: 1 });
PropertySchema.index({ isDeleted: 1 });
module.exports = mongoose.model('Property', PropertySchema);