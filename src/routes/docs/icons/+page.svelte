<script lang="ts">
	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import Svg from '$lib/Svg.svelte';
	import Glyph from '$lib/Glyph.svelte';
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
		icon_create_folder,
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
		glyph: string;
		data: import('$lib/Svg.svelte').SvgData;
	}> = [
		{name: 'unknown', glyph: '\u2047', data: icon_unknown},
		{name: 'important', glyph: '\u2048', data: icon_important},
		{name: 'info', glyph: '\u24D8', data: icon_info},
		{name: 'add', glyph: '\u271B', data: icon_add},
		{name: 'remove', glyph: '\uD83D\uDDD9', data: icon_remove},
		{name: 'delete', glyph: '\u2327', data: icon_delete},
		{name: 'clear', glyph: '\u232B', data: icon_clear},
		{name: 'restore', glyph: '\u293B', data: icon_restore},
		{name: 'cancel', glyph: '\u29B8', data: icon_cancel},
		{name: 'drag', glyph: '\u2261', data: icon_drag},
		{name: 'copy', glyph: '\u29C9', data: icon_copy},
		{name: 'paste', glyph: '\u238C', data: icon_paste},
		{name: 'reset', glyph: '\u293A', data: icon_reset},
		{name: 'refresh', glyph: '\u27F3', data: icon_refresh},
		{name: 'connect', glyph: '\u2B4D', data: icon_connect},
		{name: 'disconnect', glyph: '\u229D', data: icon_disconnect},
		{name: 'retry', glyph: '\u21BA', data: icon_retry},
		{name: 'placeholder', glyph: '\u21B3', data: icon_placeholder},
		{name: 'send', glyph: '\u2BA5', data: icon_send},
		{name: 'play', glyph: '\u25B6\uFE0E', data: icon_play},
		{name: 'pause', glyph: '\u2759\u2759', data: icon_pause},
		{name: 'checkmark', glyph: '\u2713', data: icon_checkmark},
		{name: 'checkmark_heavy', glyph: '\u2714', data: icon_checkmark_heavy},
		{name: 'xmark', glyph: '\u2717', data: icon_xmark},
		{name: 'xmark_heavy', glyph: '\u2718', data: icon_xmark_heavy},
		{name: 'download', glyph: '\u2B73', data: icon_download},
		{name: 'error', glyph: '\u203C', data: icon_error},
		{name: 'chevron_up', glyph: '\u2B9D', data: icon_chevron_up},
		{name: 'chevron_right', glyph: '\u2B9E', data: icon_chevron_right},
		{name: 'chevron_down', glyph: '\u2B9F', data: icon_chevron_down},
		{name: 'chevron_left', glyph: '\u2B9C', data: icon_chevron_left},
		{name: 'double_chevron_left', glyph: '\u00AB', data: icon_double_chevron_left},
		{name: 'double_chevron_right', glyph: '\u00BB', data: icon_double_chevron_right},
		{name: 'edit', glyph: '\u270E', data: icon_edit},
		{name: 'sort', glyph: '\u21C5', data: icon_sort},
		{name: 'chat', glyph: '\u2338', data: icon_chat},
		{name: 'thread', glyph: '\u2637', data: icon_thread},
		{name: 'turn', glyph: '\u238D', data: icon_turn},
		{name: 'file', glyph: '\u29C8', data: icon_file},
		{name: 'list', glyph: '\u25A4', data: icon_list},
		{name: 'directory', glyph: '\u25A6', data: icon_directory},
		{name: 'create_file', glyph: '\uD83D\uDDCE', data: icon_create_file},
		{name: 'create_folder', glyph: '\uD83D\uDDC1', data: icon_create_folder},
		{name: 'prompt', glyph: '\u2307', data: icon_prompt},
		{name: 'part', glyph: '\u250A', data: icon_part},
		{name: 'provider', glyph: '\u2A15', data: icon_provider},
		{name: 'model', glyph: '\u229B', data: icon_model},
		{name: 'action', glyph: '\u237E', data: icon_action},
		{name: 'view', glyph: '\u235C', data: icon_view},
		{name: 'preview', glyph: '\u29BE', data: icon_preview},
		{name: 'log', glyph: '\u2399', data: icon_log},
		{name: 'tab', glyph: '\u26F6', data: icon_tab},
		{name: 'project', glyph: '\u232C', data: icon_project},
		{name: 'capability', glyph: '\u29B0', data: icon_capability},
		{name: 'settings', glyph: '\u26EE', data: icon_settings},
		{name: 'domain', glyph: '\u27E1', data: icon_domain},
		{name: 'page', glyph: '\u233A', data: icon_page},
		{name: 'space', glyph: '\u2302', data: icon_space},
		{name: 'desk', glyph: '\u235F', data: icon_desk},
		{name: 'pin', glyph: '\u23CD', data: icon_pin},
		{name: 'terminal', glyph: '\u2328', data: icon_terminal},
		{name: 'workspace', glyph: '\u229E', data: icon_workspace},
		{name: 'idea', glyph: '\u2306', data: icon_idea},
		{name: 'ping', glyph: '\u2940', data: icon_ping},
		{name: 'heartbeat', glyph: '\u223D', data: icon_heartbeat},
		{name: 'response', glyph: '\u2B91', data: icon_response},
		{name: 'session', glyph: '\u23E3', data: icon_session},
		{name: 'action_type_local_call', glyph: '\u2933', data: icon_action_type_local_call},
		{
			name: 'action_type_remote_notification',
			glyph: '\u2959',
			data: icon_action_type_remote_notification,
		},
		{
			name: 'action_type_request_response',
			glyph: '\u296E',
			data: icon_action_type_request_response,
		},
		{name: 'external_link', glyph: '\uD83E\uDC75', data: icon_external_link},
		{name: 'arrow_right', glyph: '\u2192', data: icon_arrow_right},
		{name: 'arrow_left', glyph: '\u2190', data: icon_arrow_left},
		{name: 'backend', glyph: '\uD83D\uDF22', data: icon_backend},
	];
</script>

<TomeContent {tome}>
	<section>
		<p>
			SVG icon replacements for Unicode character glyphs. Each icon is available as <TomeLink
				name="Svg"
			/> data. The character glyph is shown on the left, the SVG icon on the right.
		</p>
	</section>
	<section>
		<div class="icons">
			{#each icon_entries as entry (entry.name)}
				<div class="icon_entry">
					<div class="icon_name">{entry.name}</div>
					<div class="icon_comparison">
						<div class="icon_cell">
							<div class="icon_frame">
								<Glyph glyph={entry.glyph} size="var(--icon_size_xl2)" />
							</div>
							<small>char</small>
						</div>
						<div class="icon_cell">
							<div class="icon_frame">
								<Svg data={entry.data} size="var(--icon_size_xl2)" shrink={false} />
							</div>
							<small>svg</small>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
</TomeContent>

<style>
	.icons {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space_md);
		justify-content: center;
	}

	.icon_entry {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space_xs);
		padding: var(--space_md);
		border-bottom: 1px solid var(--border_color, var(--text_10));
	}

	.icon_name {
		font-family: var(--font_family_mono);
		font-size: var(--font_size_sm);
	}

	.icon_comparison {
		display: flex;
		gap: var(--space_xl2);
		align-items: center;
	}

	.icon_cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space_xs);
	}

	.icon_frame {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--icon_size_xl3);
		height: var(--icon_size_xl3);
		flex-shrink: 0;
		background-color: var(--shade_20);
		border-radius: var(--radius_xs);
	}

	small {
		font-size: var(--font_size_xs);
		opacity: 0.6;
	}
</style>
