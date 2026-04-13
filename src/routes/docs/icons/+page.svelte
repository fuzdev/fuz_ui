<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import Svg from '$lib/Svg.svelte';
	import {
		icon_unknown,
		icon_important,
		icon_info,
		icon_add,
		icon_remove,
		icon_delete,
		icon_clear,
		icon_restore,
		icon_cancel,
		icon_drag,
		icon_copy,
		icon_paste,
		icon_reset,
		icon_refresh,
		icon_connect,
		icon_disconnect,
		icon_retry,
		icon_placeholder,
		icon_send,
		icon_play,
		icon_pause,
		icon_checkmark,
		icon_checkmark_heavy,
		icon_xmark,
		icon_xmark_heavy,
		icon_download,
		icon_error,
		icon_chevron_up,
		icon_chevron_right,
		icon_chevron_down,
		icon_chevron_left,
		icon_double_chevron_left,
		icon_double_chevron_right,
		icon_edit,
		icon_sort,
		icon_chat,
		icon_thread,
		icon_turn,
		icon_file,
		icon_list,
		icon_directory,
		icon_create_file,
		icon_create_directory,
		icon_prompt,
		icon_part,
		icon_provider,
		icon_model,
		icon_action,
		icon_view,
		icon_preview,
		icon_log,
		icon_tab,
		icon_project,
		icon_capability,
		icon_settings,
		icon_domain,
		icon_page,
		icon_space,
		icon_desk,
		icon_pin,
		icon_terminal,
		icon_workspace,
		icon_idea,
		icon_ping,
		icon_heartbeat,
		icon_response,
		icon_session,
		icon_action_type_local_call,
		icon_action_type_remote_notification,
		icon_action_type_request_response,
		icon_external_link,
		icon_arrow_right,
		icon_arrow_left,
		icon_backend,
	} from '$lib/icons.js';

	const LIBRARY_ITEM_NAME = 'icons';

	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);

	const icon_entries: Array<{
		name: string;
		data: import('$lib/Svg.svelte').SvgData;
	}> = [
		{name: 'unknown', data: icon_unknown},
		{name: 'important', data: icon_important},
		{name: 'info', data: icon_info},
		{name: 'add', data: icon_add},
		{name: 'remove', data: icon_remove},
		{name: 'delete', data: icon_delete},
		{name: 'clear', data: icon_clear},
		{name: 'restore', data: icon_restore},
		{name: 'cancel', data: icon_cancel},
		{name: 'drag', data: icon_drag},
		{name: 'copy', data: icon_copy},
		{name: 'paste', data: icon_paste},
		{name: 'reset', data: icon_reset},
		{name: 'refresh', data: icon_refresh},
		{name: 'connect', data: icon_connect},
		{name: 'disconnect', data: icon_disconnect},
		{name: 'retry', data: icon_retry},
		{name: 'placeholder', data: icon_placeholder},
		{name: 'send', data: icon_send},
		{name: 'play', data: icon_play},
		{name: 'pause', data: icon_pause},
		{name: 'checkmark', data: icon_checkmark},
		{name: 'checkmark_heavy', data: icon_checkmark_heavy},
		{name: 'xmark', data: icon_xmark},
		{name: 'xmark_heavy', data: icon_xmark_heavy},
		{name: 'download', data: icon_download},
		{name: 'error', data: icon_error},
		{name: 'chevron_up', data: icon_chevron_up},
		{name: 'chevron_right', data: icon_chevron_right},
		{name: 'chevron_down', data: icon_chevron_down},
		{name: 'chevron_left', data: icon_chevron_left},
		{name: 'double_chevron_left', data: icon_double_chevron_left},
		{name: 'double_chevron_right', data: icon_double_chevron_right},
		{name: 'edit', data: icon_edit},
		{name: 'sort', data: icon_sort},
		{name: 'chat', data: icon_chat},
		{name: 'thread', data: icon_thread},
		{name: 'turn', data: icon_turn},
		{name: 'file', data: icon_file},
		{name: 'list', data: icon_list},
		{name: 'directory', data: icon_directory},
		{name: 'create_file', data: icon_create_file},
		{name: 'create_directory', data: icon_create_directory},
		{name: 'prompt', data: icon_prompt},
		{name: 'part', data: icon_part},
		{name: 'provider', data: icon_provider},
		{name: 'model', data: icon_model},
		{name: 'action', data: icon_action},
		{name: 'view', data: icon_view},
		{name: 'preview', data: icon_preview},
		{name: 'log', data: icon_log},
		{name: 'tab', data: icon_tab},
		{name: 'project', data: icon_project},
		{name: 'capability', data: icon_capability},
		{name: 'settings', data: icon_settings},
		{name: 'domain', data: icon_domain},
		{name: 'page', data: icon_page},
		{name: 'space', data: icon_space},
		{name: 'desk', data: icon_desk},
		{name: 'pin', data: icon_pin},
		{name: 'terminal', data: icon_terminal},
		{name: 'workspace', data: icon_workspace},
		{name: 'idea', data: icon_idea},
		{name: 'ping', data: icon_ping},
		{name: 'heartbeat', data: icon_heartbeat},
		{name: 'response', data: icon_response},
		{name: 'session', data: icon_session},
		{name: 'action_type_local_call', data: icon_action_type_local_call},
		{name: 'action_type_remote_notification', data: icon_action_type_remote_notification},
		{name: 'action_type_request_response', data: icon_action_type_request_response},
		{name: 'external_link', data: icon_external_link},
		{name: 'arrow_right', data: icon_arrow_right},
		{name: 'arrow_left', data: icon_arrow_left},
		{name: 'backend', data: icon_backend},
	];
</script>

<TomeContent {tome}>
	<section>
		<p>
			Fuz includes a number of icons available as data that can be mounted with the <TomeLink
				name="Svg"
			/>
			component. Only the ones you use are included in your bundle.
		</p>
		<Code
			content={`import Svg from '@fuzdev/fuz_ui/Svg.svelte';\nimport {icon_add} from '@fuzdev/fuz_ui/icons.js';`}
			lang="ts"
		/>
		<Code content={`<Svg data={icon_add} />`} />
	</section>
	<section>
		<ul
			class="display:flex flex-wrap:wrap justify-content:center gap_lg text-align:center unstyled"
		>
			{#each icon_entries as entry (entry.name)}
				<li>
					<Svg data={entry.data} size="var(--icon_size_xl3)" />
					<div class="icon_name">{entry.name}</div>
				</li>
			{/each}
		</ul>
	</section>
</TomeContent>

<style>
	li {
		margin-bottom: var(--space_xl3);
	}

	li :global(svg) {
		background-color: var(--shade_05);
	}

	.icon_name {
		font-family: var(--font_family_mono);
		font-size: var(--font_size_sm);
		margin-top: var(--space_xs);
	}
</style>
