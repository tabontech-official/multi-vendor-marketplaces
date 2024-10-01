import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="flex justify-center items-center  bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-blue-500 pb-3">
          Marketplace Users Policy and Legal Disclaimers
        </h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">1. General Disclaimer</h2>
          <p className="text-gray-700 leading-relaxed">
            MEDSPATRADER.COM is a platform that facilitates transactions between buyers and sellers. 
            By using the Website, you acknowledge and agree that MEDSPATRADER.COM is not responsible for any 
            transactions, communications, or disputes that arise between users. MEDSPATRADER.COM does not own, 
            manage, or control any goods or services sold on the platform and does not guarantee the accuracy, 
            safety, legality, or quality of any items listed by users.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">2. No Warranty or Guarantee</h2>
          <p className="text-gray-700 leading-relaxed">
            MEDSPATRADER.COM provides its services on an "as is" and "as available" basis, without any warranties 
            or guarantees, express or implied. This includes, but is not limited to, any warranties of merchantability, 
            fitness for a particular purpose, or non-infringement. MEDSPATRADER.COM makes no representations about the 
            accuracy or completeness of content on the site and assumes no responsibility for any errors or omissions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">3. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            To the fullest extent permitted by law, MEDSPATRADER.COM, its owners, employees, agents, and affiliates 
            shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of 
            or in connection with your use of the Website. This includes, but is not limited to, damages related to 
            loss of profits, data, use, or goodwill, whether in contract, tort, negligence, or otherwise.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">4. User Responsibility</h2>
          <p className="text-gray-700 leading-relaxed">
            All users of the Website are encouraged to exercise caution and due diligence when engaging in transactions 
            or sharing personal information. It is your responsibility to research the individuals, businesses, and 
            products you engage with on the platform. MEDSPATRADER.COM strongly recommends reviewing a seller's reputation, 
            reading product descriptions carefully, and using secure payment methods.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">5. No Endorsement</h2>
          <p className="text-gray-700 leading-relaxed">
            MEDSPATRADER.COM does not endorse, sponsor, or verify any users, listings, or products posted on the Website. 
            Any opinions, advice, statements, or other information or content expressed by users are solely those of the 
            respective author(s) and not of MEDSPATRADER.COM.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">6. External Links</h2>
          <p className="text-gray-700 leading-relaxed">
            The Website may contain links to third-party websites. MEDSPATRADER.COM is not responsible for the content 
            or privacy practices of such external sites, and accessing them is done at your own risk.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">7. Indemnification</h2>
          <p className="text-gray-700 leading-relaxed">
            By using the Website, you agree to indemnify, defend, and hold harmless MEDSPATRADER.COM, its affiliates, employees, 
            agents, and service providers from and against any and all claims, liabilities, damages, losses, costs, expenses, 
            or fees (including reasonable attorneys' fees) arising out of or related to your use of the Website, any transactions 
            made on the platform, or any violation of this disclaimer or applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-600 mb-3">8. Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            This disclaimer is governed by the laws of the State of Florida. Any disputes arising from your use of the Website 
            or its terms will be subject to the exclusive jurisdiction of the courts in the State of Florida.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
