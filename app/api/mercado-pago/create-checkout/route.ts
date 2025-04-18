import mpClient from '@/app/lib/mercado-pago';
import { Preference } from 'mercadopago';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { testeId, userEmail } = await req.json();

  try {
    const preference = new Preference(mpClient);

    const createdPreference = await preference.create({
      body: {
        external_reference: testeId, // Isso impacta na pontuação do Mercado Pago
        metadata: {
          testeId, // Essa variável é convertida para snake_case -> teste_id
          userEmail,
        },
        ...(userEmail && { payer: { email: userEmail } }), // Também é importante para a pontuação do Mercado Pago
        items: [
          {
            id: '',
            description: '',
            title: '',
            quantity: 1,
            unit_price: 1,
            currency_id: 'BRL',
            category_id: 'services',
          },
        ],
        payment_methods: {
          installments: 12,
          // excluded_payment_methods: [
          //   {
          //     id: 'bolbradesco',
          //   },
          //   {
          //     id: 'pec',
          //   }
          // ],
          // excluded_payment_types: [
          //   {
          //     id: 'debit_card',
          //   },
          //   {
          //     id: 'credit_card'
          //   }
          // ]
        },
        auto_return: 'approved',
        back_urls: {
          success: `${req.headers.get('origin')}/api/mercado-pago/pending`,
          failure: `${req.headers.get('origin')}/api/mercado-pago/pending`,
          pending: `${req.headers.get('origin')}/api/mercado-pago/pending`,
        },
      },
    });

    if (!createdPreference.id) {
      return NextResponse.json(
        { error: 'Error ao criar checkout com Mercado Pago' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error ao criar checkout com Mercado Pago' },
      { status: 500 }
    );
  }
}
