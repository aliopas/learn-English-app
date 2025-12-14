import { useState } from 'react'
import { FileText, Check } from 'lucide-react'

const TermsAndConditionsModal = ({ onAccept }) => {
    const [scrolledToBottom, setScrolledToBottom] = useState(false)

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            setScrolledToBottom(true)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Terms and Conditions</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Please read carefully before proceeding</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div
                    className="flex-1 overflow-y-auto p-8 space-y-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-purple-900"
                    onScroll={handleScroll}
                >
                    <div className="prose dark:prose-invert max-w-none">
                        <h3>Terms and Conditions</h3>
                        <p><strong>Last Updated:</strong> December 11, 2025<br />
                            <strong>Jurisdiction:</strong> Kingdom of Saudi Arabia</p>

                        <h4>1. Acceptance of Terms</h4>
                        <p>By accessing or using this website and its services (the "Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Service.</p>

                        <h4>2. Service Description</h4>
                        <p>We provide English Language Learning Platform through our platform. We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without prior notice.</p>

                        <h4>3. User Accounts and Subscriptions</h4>
                        <h5>3.1 Account Registration</h5>
                        <ul>
                            <li>You must provide accurate and complete information during registration</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                            <li>You are responsible for all activities that occur under your account</li>
                        </ul>

                        <h5>3.2 Subscription Terms</h5>
                        <ul>
                            <li>Subscriptions are billed on a recurring basis (monthly/annually as selected)</li>
                            <li>Payment is due at the beginning of each billing cycle</li>
                            <li>Subscription fees are non-refundable except as required by law</li>
                        </ul>

                        <h4>4. Payment and Refund Policy</h4>
                        <h5>4.1 Payment</h5>
                        <ul>
                            <li>All fees are quoted in Saudi Riyals (SAR) and are non-refundable</li>
                            <li>You authorize us to charge your payment method on a recurring basis</li>
                            <li>Prices include VAT (Value Added Tax) at 15% as required by Saudi Arabian law</li>
                            <li>You are responsible for any additional taxes applicable to your subscription</li>
                        </ul>

                        <h5>4.2 No Refund Policy</h5>
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/30 my-4">
                            <p className="font-bold text-red-600 dark:text-red-400 mb-2">IMPORTANT: All subscription fees are final and non-refundable as permitted by Saudi Arabian E-Commerce Law. This includes but is not limited to:</p>
                            <ul className="list-disc pl-5 space-y-1 text-red-700 dark:text-red-300">
                                <li>Partial month or year subscriptions</li>
                                <li>Services that have been discontinued or modified after your subscription date</li>
                                <li>Unused portions of your subscription period</li>
                                <li>Dissatisfaction with the Service</li>
                                <li>Service interruptions or termination by us</li>
                            </ul>
                            <p className="mt-2 text-red-700 dark:text-red-300">By subscribing, you acknowledge and agree that no refunds will be provided under any circumstances, including if we discontinue, modify, or terminate the Service during your active subscription period. This policy complies with Article 10 of the E-Commerce Law regarding consumer rights and digital services.</p>
                        </div>

                        <p><strong>Consumer Rights:</strong> While this no-refund policy applies to subscription services, your statutory rights under Saudi consumer protection laws for defective services or fraudulent practices remain unaffected.</p>

                        <h4>5. Service Modifications and Termination</h4>
                        <h5>5.1 Our Rights</h5>
                        <p>We reserve the right to:</p>
                        <ul>
                            <li>Modify, suspend, or discontinue the Service (or any part thereof) at any time</li>
                            <li>Change subscription fees for future billing cycles with reasonable notice</li>
                            <li>Terminate or suspend your account for violation of these Terms</li>
                            <li>Update these Terms and Conditions at our discretion</li>
                        </ul>

                        <h5>5.2 No Liability for Service Changes</h5>
                        <p>We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service. You acknowledge that continued payment of subscription fees after service changes constitutes acceptance of those changes.</p>

                        <h4>6. Limitation of Liability</h4>
                        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                        <ul>
                            <li>The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind</li>
                            <li>We are not liable for any indirect, incidental, special, or consequential damages</li>
                            <li>Our total liability shall not exceed the amount you paid in the 3 months prior to the claim</li>
                            <li>We are not responsible for any loss of data, profits, or business interruption</li>
                        </ul>

                        <h4>7. User Responsibilities</h4>
                        <p>You agree to:</p>
                        <ul>
                            <li>Use the Service only for lawful purposes</li>
                            <li>Not violate any applicable laws or regulations</li>
                            <li>Not attempt to gain unauthorized access to our systems</li>
                            <li>Not interfere with or disrupt the Service</li>
                            <li>Not use the Service to transmit harmful code or content</li>
                        </ul>

                        <h4>8. Intellectual Property</h4>
                        <p>All content, features, and functionality of the Service are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.</p>

                        <h4>9. Privacy</h4>
                        <p>Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of information as outlined in our Privacy Policy.</p>

                        <h4>10. Cancellation</h4>
                        <p>You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period. No refunds will be provided for the remaining subscription period.</p>

                        <h4>11. Dispute Resolution and Governing Law</h4>
                        <h5>11.1 Governing Law</h5>
                        <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia, including but not limited to:</p>
                        <ul>
                            <li>The E-Commerce Law issued by Royal Decree No. M/126 dated 10/10/1440H</li>
                            <li>The Electronic Transactions Law</li>
                            <li>Regulations issued by the Saudi Arabian Monetary Authority (SAMA)</li>
                            <li>The Ministry of Commerce regulations</li>
                        </ul>

                        <h5>11.2 Dispute Resolution</h5>
                        <ul>
                            <li>Any disputes arising from these Terms shall first be resolved through good faith negotiations</li>
                            <li>If negotiations fail, disputes shall be referred to the competent courts in the Kingdom of Saudi Arabia</li>
                            <li>For commercial disputes exceeding SAR 200,000, parties may agree to arbitration under the Saudi Arbitration Law</li>
                        </ul>

                        <h4>12. Indemnification</h4>
                        <p>You agree to indemnify and hold us harmless from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
                        <ul>
                            <li>Your use of the Service</li>
                            <li>Your violation of these Terms</li>
                            <li>Your violation of any rights of another party</li>
                        </ul>

                        <h4>13. Severability</h4>
                        <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>

                        <h4>14. Entire Agreement</h4>
                        <p>These Terms constitute the entire agreement between you and us regarding the Service and supersede all prior agreements and understandings.</p>

                        <h4>15. Contact Information</h4>
                        <p>For questions about these Terms and Conditions, please contact us at:</p>
                        <ul>
                            <li>Email:rakan87651234@icloud.com</li>
                            <li>Phone:0537541696</li>
                            <li>Address: Riyadh, Saudi Arabia</li>
                        </ul>
                        <p>Our business hours are 9:00 AM - 5:00 PM Saudi Arabia Time (GMT+3).</p>

                        <h4>16. Acknowledgment</h4>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 font-medium">
                            <p className="uppercase">BY CLICKING "I AGREE" OR BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS, INCLUDING THE NO-REFUND POLICY.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl shrink-0">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                            By clicking "I Agree", you acknowledge that you have read and understood these terms.
                        </p>
                        <button
                            onClick={onAccept}
                            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            <span>I Agree / أوافق</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TermsAndConditionsModal
