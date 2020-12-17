<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\MemberService;
use Exception;

class MemberController extends Controller
{
    /**
     * @var \App\Services\MemberService $memberService
     */
    protected $memberService;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(MemberService $memberService)
    {
        $this->memberService = $memberService;
    }

    /**
     * Get a part of shops via database
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMembers(Request $request)
    {
        try {
            $result = $this->memberService->getMembers($request->query());
        } catch (Exception $e) {
            return response()->json([
                'status' => $e->getCode(),
                'messages' => unserialize($e->getMessage())
            ], $e->getCode());
        }

        return response()->json($result);
    }
}