@props(['disabled' => false])

<input @disabled($disabled) {{ $attributes->merge(['class' => 'bg-black border-purple-900/30 text-white placeholder-gray-500 focus:border-purple-600 focus:ring-purple-600 rounded-md shadow-sm autofill:bg-black autofill:text-white']) }}
    style="-webkit-text-fill-color: #f3f4f6; -webkit-box-shadow: 0 0 0px 1000px #000 inset;">
