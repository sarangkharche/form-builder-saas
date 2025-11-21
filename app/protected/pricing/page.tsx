import { createUpdateClient } from "@/utils/update/server";
import PricingContent from "@/components/pricing-content";

export default async function PricingPage() {
  const client = await createUpdateClient();
  const { data, error } = await client.billing.getProducts();
  const { data: subscriptionData } = await client.billing.getSubscriptions();

  if (error) {
    return <div>There was an error loading products. Please try again.</div>;
  }

  const currentProductId =
    subscriptionData.subscriptions == null ||
    subscriptionData.subscriptions.length === 0
      ? null
      : subscriptionData.subscriptions[0].product.id;

  return (
    <>
      <div>
        <h1 className="text-2xl font-medium">Pricing Plans</h1>
        <p className="text-muted-foreground mt-2">
          Choose the perfect plan for your form builder needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 my-8 p-6 bg-muted/30 rounded-lg">
        <div>
          <h3 className="font-semibold mb-3">Free Plan</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ 1 form</li>
            <li>✓ 50 submissions per month</li>
            <li>✓ All field types</li>
            <li>✓ CSV export</li>
            <li>✗ Email notifications</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Pro Plan - £9/month</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Unlimited forms</li>
            <li>✓ Unlimited submissions</li>
            <li>✓ All field types</li>
            <li>✓ CSV export</li>
            <li>✓ Email notifications</li>
          </ul>
        </div>
      </div>

      <PricingContent
        products={data.products}
        currentProductId={currentProductId}
      />
    </>
  );
}
