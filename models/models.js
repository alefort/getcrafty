"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = {
    schema: {
        inventory: new Schema({
            product_id: Number,
            store_id: Number,
            is_dead: Boolean,
            quantity: Number,
            updated_on: Date,
            updated_at: Date,
            product_no: Number,
            store_no: Number
        }),
        store: new Schema( {
            id: Number,
            is_dead: Boolean,
            name: String,
            tags: String,
            address_line_1: String,
            address_line_2: String,
            city: String,
            postal_code: String,
            telephone: String,
            fax: String,
            location: {
                latitude: Number,
                longitude: Number
            },
            latitude: Number,
            longitude: Number,
            products_count: Number,
            inventory_count: Number,
            inventory_price_in_cents: Number,
            inventory_volume_in_milliliters: Number,
            has_wheelchair_accessability: Boolean,
            has_bilingual_services: Boolean,
            has_product_consultant: Boolean,
            has_tasting_bar: Boolean,
            has_beer_cold_room: Boolean,
            has_special_occasion_permits: Boolean,
            has_vintages_corner: Boolean,
            has_parking: Boolean,
            has_transit_access: Boolean,
            sunday_open: Number,
            sunday_close: Number,
            monday_open: Number,
            monday_close: Number,
            tuesday_open: Number,
            tuesday_close: Number,
            wednesday_open: Number,
            wednesday_close: Number,
            thursday_open: Number,
            thursday_close: Number,
            friday_open: Number,
            friday_close: Number,
            saturday_open: Number,
            saturday_close: Number,
            updated_at: Date,
            store_no: Number
        }),
        product: new Schema( {
            id: Number,
            is_dead: Boolean,
            name: String,
            tags: String,
            is_discontinued: Boolean,
            price_in_cents: Number,
            regular_price_in_cents: Number,
            limited_time_offer_savings_in_cents: Number,
            limited_time_offer_ends_on: Date,
            bonus_reward_miles: Number,
            bonus_reward_miles_ends_on: Date,
            stock_type: String,
            primary_category: String,
            secondary_category: String,
            origin: String,
            package: String,
            package_unit_type: String,
            package_unit_volume_in_milliliters: Number,
            total_package_units: Number,
            volume_in_milliliters: Number,
            alcohol_content: Number,
            price_per_liter_of_alcohol_in_cents: Number,
            price_per_liter_in_cents: Number,
            inventory_count: Number,
            inventory_volume_in_milliliters: Number,
            inventory_price_in_cents: Number,
            sugar_content: String,
            producer_name: String,
            released_on: Date,
            has_value_added_promotion: Boolean,
            has_limited_time_offer: Boolean,
            has_bonus_reward_miles: Boolean,
            is_seasonal: Boolean,
            is_vqa: Boolean,
            is_ocb: Boolean,
            is_kosher: Boolean,
            value_added_promotion_description: String,
            description: String,
            serving_suggestion: String,
            tasting_note: String,
            updated_at: Date,
            image_thumb_url: String,
            image_url: String,
            varietal: String,
            style: String,
            tertiary_category: String,
            sugar_in_grams_per_liter: Number,
            clearance_sale_savings_in_cents: Number,
            has_clearance_sale: Boolean,
            product_no: Number
        })
    }
};