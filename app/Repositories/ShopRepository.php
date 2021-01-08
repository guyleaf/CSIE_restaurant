<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class ShopRepository
{
    /**
     * @var \Illuminate\Database\Query\Builder $shopTable
     */
    protected $shopTable;

    /**
     * @var \Illuminate\Database\Query\Builder $shopsInfoView
     *
     * Columns: member_id, name, header_image, category_id, numberOfRatings, averageOfRatings
     */
    protected $shopsInfoView;

    /**
     * @var \Illuminate\Database\Query\Builder $categoryTable
     */
    protected $categoryTable;

    /**
     * Shop Repository constructor
     *
     * @return void
     */
    public function __construct()
    {
        $this->shopTable = DB::table('seller', 'S');
        $this->categoryTable = DB::table('seller_category', 'SC');
        $this->shopsInfoView = DB::table('seller_card_view', 'SCV');
    }

    /**
     * Get shops
     *
     * @param integer $currentNumber
     * @param integer $requiredNumber
     * @return \Illuminate\Support\Collection
     */
    public function getShops($currentNumber, $requiredNumber)
    {
        $shops = $this->shopsInfoView
            ->skip($currentNumber)
            ->take($requiredNumber)
            ->get(['member_id as seller_id', 'name', 'counter_number', 'header_image', 'numberofratings', 'averageofratings']);

        return $shops;
    }

    /**
     * Get shops by filters
     *
     * @param integer $currentNumber
     * @param integer $requiredNumber
     * @param array:id $filters
     * @return \Illuminate\Support\Collection
     */
    public function getShopsByfilters($currentNumber, $requiredNumber, $filters)
    {
        $shops = $this->shopsInfoView
            ->join('seller_category_list as SCL', 'SCL.seller_id', '=', 'member_id')
            ->whereIn('SCL.category_id', $filters)
            ->skip($currentNumber)
            ->take($requiredNumber)
            ->distinct()
            ->get(['member_id as seller_id', 'name', 'counter_number', 'header_image', 'numberofratings', 'averageofratings']);

        return $shops;
    }

    public function getCategories()
    {
        $category = $this->categoryTable
            ->get();

        return $category;
    }

    public function getShopInfoByShopId($id)
    {
        $info = $this->shopTable
            ->join('member as M', 'id','=','member_id')
            ->where('member_id','=', $id)
            ->get(['name','description','created_at']);
        return $info;
    }

    public function getProductCategoriesByShopId($id)
    {
        $category = $this->shopTable
            ->join('product_category as PC', 'seller_id','=','member_id')
            ->where('member_id','=', $id)
            ->get(['PC.name','display_order']);
        return $category;
    }

    public function searchShops($keywords)
    {
        $result = $this->shopTable
        ->join('member as M', 'M.id', '=', 'S.member_id')
        ->Where(function ($query) use($keywords) {
            for ($i = 0; $i < count($keywords); $i++){
               $query->orwhere('M.name', 'like',  '%' . $keywords[$i] .'%');
            }
       })->get(['S.member_id as seller_id', 'M.name', 'S.description', 'S.counter_number', 'S.header_image']);

       return $result;
    }
}
?>
