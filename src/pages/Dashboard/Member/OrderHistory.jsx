// 📁 File: src/pages/Dashboard/Member/OrderHistory.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { format } from 'date-fns';
import { FaBoxOpen } from "react-icons/fa";

const OrderHistory = () => {
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['order-history'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/orders');
            return data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-4xl font-bold mb-8">My Order History</h1>

            {orders.length > 0 ? (
                <div className="bg-base-100 rounded-lg shadow-md overflow-x-auto">
                    <table className="table w-full">
                        {/* head */}
                        <thead className="bg-base-200">
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>
                                        <span className="font-mono text-xs">{order.transactionId || order._id}</span>
                                    </td>
                                    <td>{format(new Date(order.createdAt), 'dd MMM, yyyy')}</td>
                                    <td>${order.totalAmount.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${
                                            order.status === 'Paid' ? 'badge-success' : 'badge-warning'
                                        }`}>{order.status}</span>
                                    </td>
                                    <td>
                                        <button className="btn btn-primary btn-xs">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-16 bg-base-100 rounded-lg shadow">
                    <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">No Orders Found</h3>
                    <p className="text-base-content/70">You haven't made any purchases yet.</p>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;