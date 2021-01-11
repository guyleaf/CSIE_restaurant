<?php
namespace App\Services;

use App\Repositories\CouponRepository;
use App\Repositories\ProductRepository;
use Exception;
use Intervention\Image\Facades\Image as Image;

class SellerService
{
    /**
     * @var \App\Repositories\CouponRepository $couponRepository
     */
    protected $couponRepository;

    /**
     * @var \App\Repositories\ProductRepository $productRepository
     */
    protected $productRepository;

    /**
     * Shop service constructor
     *
     * @param \App\Repositories\CouponRepository $couponRepository
     * @param \App\Repositories\ProductRepository $productRepository
     */
    public function __construct(CouponRepository $couponRepository, ProductRepository $productRepository)
    {
        $this->couponRepository = $couponRepository;
        $this->productRepository = $productRepository;
    }

    public function addCoupon($seller_id, $payload)
    {
        $coupon_id = $this->couponRepository->addCoupon($seller_id, $payload);

        return $coupon_id;
    }

    public function deleteCoupon($id)
    {
        $this->couponRepository->deleteCoupon($id);
    }

    public function updateCoupon($payload)
    {
        $this->couponRepository->updateCoupon($payload);
    }

    public function addProduct($seller_id, $payload)
    {
        $image = Image::make($payload['image'])->resize(200, 200)->encode('jpg');
        unset($payload['image']);

        $product_id = $this->productRepository->addProduct($seller_id, $payload, 'jpg');

        $image_path = 'storage/restaurant/' . strval($seller_id);
        $image_name = strval($product_id) . '.jpg';

        $image->save($image_path. '/' . $image_name, 100);

        $image_path = '/storage/restaurant/' . strval($seller_id);
        return ['product_id' => $product_id, 'image_path' => $image_path . '/' . $image_name];
    }

    public function deleteProduct($id)
    {
        $this->productRepository->deleteProduct($id);
    }

    public function updateProduct($seller_id, $payload)
    {
        if (!empty($payload['image']))
        {
            $image = Image::make($payload['image'])->resize(200, 200)->encode('jpg');
            unset($payload['image']);
        }

        $this->productRepository->updateProduct($payload);

        if (!empty($payload['image']))
        {
            $product_id = $payload['id'];

            $image_path = 'storage/restaurant/' . strval($seller_id);
            $image_name = strval($product_id) . '.jpg';
            unlink($image_path. '/' . $image_name);
            $image->save($image_path. '/' . $image_name, 100);
        }
    }
}
?>
