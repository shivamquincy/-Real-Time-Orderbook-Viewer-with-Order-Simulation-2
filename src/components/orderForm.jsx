'use client'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

const OrderForm = () => {
  const schema = Yup.object().shape({
    venue: Yup.string().required('Venue is required'),
    symbol: Yup.string().required('Symbol is required'),
    orderType: Yup.string().required('Order type is required'),
    side: Yup.string().required('Side is required'),
    quantity: Yup.number()
      .typeError('Quantity must be a number')
      .positive('Quantity must be positive')
      .required('Quantity is required'),
    price: Yup.number()
      .typeError('Price must be a number')
      .positive('Price must be positive')
      .when('orderType', {
        is: 'Limit',
        then: (schema) => schema.required('Price is required for Limit orders'),
        otherwise: (schema) => schema.notRequired(),
      }),
    delay: Yup.string().required('Timing is required'),
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      venue: '',
      orderType: '',
      side: '',
      delay: '',
    },
  })

  const onSubmit = (data) => {
    console.log('Form Data:', data)
  }

  const selectedOrderType = watch('orderType')

  return (
    <div className="bg-[#141d18] p-6 rounded-xl text-white shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Order Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Venue */}
        <div>
          <label className="block mb-1">Venue</label>
          <select {...register('venue')} className="w-full bg-[#000003] p-2 rounded">
            <option value="">Select Venue</option>
            <option value="OKX">OKX</option>
            <option value="Bybit">Bybit</option>
            <option value="Deribit">Deribit</option>
          </select>
          <p className="text-red-500 text-sm">{errors.venue?.message}</p>
        </div>

        {/* Symbol */}
        <div>
          <label className="block mb-1">Symbol</label>
          <input
            {...register('symbol')}
            placeholder="e.g., BTC-USD"
            className="w-full bg-[#000003] p-2 rounded"
          />
          <p className="text-red-500 text-sm">{errors.symbol?.message}</p>
        </div>

        {/* Order Type */}
        <div>
          <label className="block mb-1">Order Type</label>
          <select {...register('orderType')} className="w-full bg-[#000003] p-2 rounded">
            <option value="">Select Type</option>
            <option value="Market">Market</option>
            <option value="Limit">Limit</option>
          </select>
          <p className="text-red-500 text-sm">{errors.orderType?.message}</p>
        </div>

        {/* Side */}
        <div>
          <label className="block mb-1">Side</label>
          <select {...register('side')} className="w-full bg-[#000003] p-2 rounded">
            <option value="">Select Side</option>
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
          <p className="text-red-500 text-sm">{errors.side?.message}</p>
        </div>

        {/* Price (only if Limit order) */}
        {selectedOrderType === 'Limit' && (
          <div>
            <label className="block mb-1">Price</label>
            <input
              {...register('price')}
              placeholder="Enter price"
              className="w-full bg-[#000003] p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.price?.message}</p>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block mb-1">Quantity</label>
          <input
            {...register('quantity')}
            placeholder="Enter quantity"
            className="w-full bg-[#000003] p-2 rounded"
          />
          <p className="text-red-500 text-sm">{errors.quantity?.message}</p>
        </div>

        {/* Delay */}
        <div>
          <label className="block mb-1">Timing Simulation</label>
          <select {...register('delay')} className="w-full bg-[#000003] p-2 rounded">
            <option value="">Select Delay</option>
            <option value="0">Immediate</option>
            <option value="5">5s Delay</option>
            <option value="10">10s Delay</option>
            <option value="30">30s Delay</option>
          </select>
          <p className="text-red-500 text-sm">{errors.delay?.message}</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition text-white py-2 px-4 rounded"
        >
          Submit Order
        </button>
      </form>
    </div>
  )
}

export default OrderForm