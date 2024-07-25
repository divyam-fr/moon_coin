module cc::template {
    struct TEMPLATE {}
    const DECIMAL: u8 = 0;
    const NAME: vector<u8> = b"name";
    const SYMBOL: vector<u8> = b"symbol";
    fun init_module(sender: &signer) {
        aptos_framework::managed_coin::initialize<TEMPLATE>(
            sender,
            NAME,
            SYMBOL,
            DECIMAL,
            false,
        );
    }
}
